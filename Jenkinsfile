pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'github_pat'                  // Jenkins credentials ID
        DOCKERHUB_USERNAME = 'budhathribandara'             // Docker Hub username
        IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images with Compose') {
            steps {
                sh '''#!/bin/bash
                set -eu
                echo "Building images from docker-compose.yml..."
                docker compose -f docker-compose.yml build --parallel
                '''
            }
        }

        stage('Tag Images for Docker Hub') {
            steps {
                script {
                    // Tag backend and frontend images
                    sh """
                    docker tag health_backend ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG}
                    docker tag health_backend ${DOCKERHUB_USERNAME}/health-backend:latest
                    docker tag health_frontend ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG}
                    docker tag health_frontend ${DOCKERHUB_USERNAME}/health-frontend:latest
                    """
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
                        sh """
                        docker push ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG}
                        docker push ${DOCKERHUB_USERNAME}/health-backend:latest
                        docker push ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG}
                        docker push ${DOCKERHUB_USERNAME}/health-frontend:latest
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Successfully built and pushed backend and frontend images!"
        }
        failure {
            echo "❌ Build or push failed. Check Jenkins logs for details."
        }
    }
}
