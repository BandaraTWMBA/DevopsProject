pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub'
        DOCKERHUB_USERNAME = 'budhathri'
        IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

       stage('Build Docker Images') {
            steps {
                script {
                    // Prune before building to ensure we have space
                    sh "docker system prune -f" 

                    echo "Building Backend..."
                    sh "docker build -t health_backend ./backend"
                    
                    echo "Building Frontend..."
                    sh "docker build -t health_frontend ./frontend"
                }
            }
        }
        stage('Tag & Push Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
                        // Tag and Push Backend
                        sh "docker tag health_backend ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG}"
                        sh "docker tag health_backend ${DOCKERHUB_USERNAME}/health-backend:latest"
                        sh "docker push ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG}"
                        sh "docker push ${DOCKERHUB_USERNAME}/health-backend:latest"

                        // Tag and Push Frontend
                        sh "docker tag health_frontend ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG}"
                        sh "docker tag health_frontend ${DOCKERHUB_USERNAME}/health-frontend:latest"
                        sh "docker push ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG}"
                        sh "docker push ${DOCKERHUB_USERNAME}/health-frontend:latest"
                    }
                }
            }
        }

        stage('Deploy to AWS') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    dir('terraform') {
                        // 1. Initialize Terraform
                        sh 'terraform init'

                        // 2. FORCE REPLACEMENT: This ensures you get a fresh server with the NEW code every time.
                        // If we don't do this, Terraform might say "No changes" and keep the old app running.
                        sh 'terraform taint aws_instance.app_server || true'

                        // 3. Apply Changes (Create Server)
                        sh 'terraform apply -auto-approve'
                        
                        // 4. Save the IP address to a file so we can see it
                        sh 'terraform output -raw public_ip > deploy_ip.txt'
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                // Read the IP address we saved
                def server_ip = readFile('terraform/deploy_ip.txt').trim()
                
                echo "✅ Deployment Successful!"
                echo "--------------------------------------------------"
                echo "🌐 YOUR APP IS LIVE AT: http://${server_ip}:5173"
                echo "--------------------------------------------------"
            }
        }
        failure {
            echo "❌ Deployment Failed. Check the logs above."
        }
    }
}