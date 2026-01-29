pipeline {
    agent any

    environment {
        DOCKER_REGISTRY_CRED_ID = 'dockerhub'
        DOCKERHUB_USERNAME      = 'budhathri'
        BACKEND_IMAGE           = 'health_backend'
        FRONTEND_IMAGE          = 'health_frontend'
        AWS_CREDS_ID            = 'aws-creds'
        AWS_DEFAULT_REGION      = 'us-east-1'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                script {
                    // 1. Build Frontend
                    sh "docker build -t $DOCKERHUB_USERNAME/$FRONTEND_IMAGE:latest ./frontend"
                    
                    // 2. Build Backend
                    sh "docker build -t $DOCKERHUB_USERNAME/$BACKEND_IMAGE:latest ./backend"
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: DOCKER_REGISTRY_CRED_ID,
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        
                        docker push $DOCKERHUB_USERNAME/$FRONTEND_IMAGE:latest
                        docker push $DOCKERHUB_USERNAME/$BACKEND_IMAGE:latest
                        
                        docker logout
                        '''
                    }
                }
            }
        }

        stage('Provision Infrastructure') {
            steps {
                dir('terraform') {
                    withCredentials([
                        usernamePassword(credentialsId: AWS_CREDS_ID, usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        sh '''
                        # --- FIX 1: ADD -upgrade HERE ---
                        terraform init -upgrade
                        
                        # --- FIX 2: REMOVE -var flags (Your main.tf doesn't use them) ---
                        terraform plan
                        terraform apply -auto-approve
                        
                        # --- FIX 3: USE "public_ip" (Matches your main.tf output) ---
                        terraform output -raw public_ip > ../server_ip.txt
                        '''
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    if (!fileExists('server_ip.txt')) {
                        error "server_ip.txt was not found."
                    }
                    def SERVER_IP = readFile('server_ip.txt').trim()
                    echo "Deploying to Server at: ${SERVER_IP}"
                    
                    // Wait for EC2 to be fully ready
                    sleep time: 45, unit: 'SECONDS' 

                    sshagent(credentials: ['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${SERVER_IP} '
                                # 1. Pull Latest Images
                                sudo docker pull mongo:6
                                sudo docker pull ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE}:latest
                                sudo docker pull ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE}:latest

                                # 2. Cleanup Old Containers & Network
                                sudo docker stop health-frontend health-backend mongo-db || true
                                sudo docker rm health-frontend health-backend mongo-db || true
                                sudo docker network rm app-network || true

                                # 3. Create Network
                                sudo docker network create app-network

                                # 4. Start MongoDB
                                sudo docker run -d --name mongo-db --network app-network -p 27017:27017 mongo:6

                                # 5. Start Backend
                                sudo docker run -d --name health-backend --network app-network -p 5000:5000 -e MONGODB_URI="mongodb://mongo-db:27017/devops" ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE}:latest

                                # 6. Start Frontend (Injecting Public IP)
                                sudo docker run -d --name health-frontend --network app-network -p 80:5173 -e VITE_API_URL="http://${SERVER_IP}:5000" ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE}:latest
                            '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}