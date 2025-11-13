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
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
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
        stage('Run Containers') {
            steps {
          script {
              sh '''
              echo "Starting containers using docker-compose..."
              docker-compose -f docker-compose.yml up -d
              docker ps
              '''
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
