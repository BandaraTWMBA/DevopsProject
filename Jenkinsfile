pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub'                  // Jenkins credentials ID (username/password or token)
        DOCKERHUB_USERNAME = 'BudhathriBandara'              // <-- replace with your Docker Hub username
        // IMAGE_TAG will be computed in a shell step because sh() returns stdout in a pipeline step
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Determine Image Tag') {
            steps {
                script {
                    IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    echo "Using image tag: ${IMAGE_TAG}"
                }
            }
        }

        stage('Build Docker Images with Compose') {
            steps {
                script {
                    // Build images as defined in docker-compose.yml
                    sh "docker-compose -f docker-compose.yml build --parallel"
                }
            }
        }

        stage('Tag Images for Docker Hub') {
            steps {
                script {
                    // Tag local images (names from your compose)
                    sh """
                        docker tag health_backend ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG}
                        docker tag health_backend ${DOCKERHUB_USERNAME}/health-backend:latest
                        docker tag health_frontend ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG}
                        docker tag health_frontend ${DOCKERHUB_USERNAME}/health-frontend:latest
                    """
                }
            }
        }

        stage('Login & Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
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
            echo "✅ Successfully built and pushed backend & frontend images."
        }
        failure {
            echo "❌ Build or push failed. Check logs."
        }
    }
}
