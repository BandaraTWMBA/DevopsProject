
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
                script {
                    sh "docker-compose build"
                }
            }
        }

        stage('Tag Images for Docker Hub') {
            steps {
                script {
                    // Tag backend and frontend images
                    sh """
                    docker tag health_backend_ci ${DOCKERHUB_USERNAME}/health_backend_ci:${IMAGE_TAG}
                    docker tag health_backend_ci ${DOCKERHUB_USERNAME}/health_backend_ci:latest
                    docker tag health_frontend_ci ${DOCKERHUB_USERNAME}/health_frontend_ci:${IMAGE_TAG}
                    docker tag health_frontend_ci ${DOCKERHUB_USERNAME}/health_frontend_ci:latest
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
                        sh """
                        docker push ${DOCKERHUB_USERNAME}/health_backend_ci:${IMAGE_TAG}
                        docker push ${DOCKERHUB_USERNAME}/health_backend_ci:latest
                        docker push ${DOCKERHUB_USERNAME}/health_frontend_ci:${IMAGE_TAG}
                        docker push ${DOCKERHUB_USERNAME}/health_frontend_ci:latest
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Successfully built and pushed both backend and frontend images!"
        }
        failure {
            echo "❌ Build or push failed. Check Jenkins logs for details."
        }
    }
}