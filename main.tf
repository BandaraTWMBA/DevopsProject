terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"  # Change this if you are not in US East 1
}

# 1. Create a Security Group (The Firewall)
resource "aws_security_group" "web_sg" {
  name        = "devops-project-sg"
  description = "Allow HTTP, Backend, and SSH traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # SSH Access
  }

  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Frontend (Vite/React)
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Backend (Node.js)
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. Create the Server (EC2 Instance)
resource "aws_instance" "app_server" {
  ami           = "ami-0e2c8ccd4e1ffc3c5" # Ubuntu 22.04 LTS (US-East-1)
  instance_type = "t3.micro"           
  key_name      = "my-key-pair"   

  vpc_security_group_ids = [aws_security_group.web_sg.id]

  # 3. The Magic Script: This runs automatically when the server turns on
  user_data = <<-EOF
              #!/bin/bash
              # Update and install Docker
              sudo apt-get update -y
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo systemctl enable docker
              
              # Install Docker Compose
              sudo apt-get install -y docker-compose-plugin

              # Create a Project Directory
              mkdir -p /home/ubuntu/app
              cd /home/ubuntu/app

              # Create the Production docker-compose.yml file
              # We use 'cat' to write this file directly to the server
              cat <<EOT > docker-compose.yml
              services:
                backend:
                  image: budhathribandara/health-backend:latest
                  ports:
                    - "5000:5000"
                  environment:
                    - MONGODB_URI=mongodb://mongo:27017/devops_db
                  depends_on:
                    - mongo
                  restart: always

                frontend:
                  image: budhathribandara/health-frontend:latest
                  ports:
                    - "5173:5173"
                  depends_on:
                    - backend
                  restart: always

                mongo:
                  image: mongo:6
                  ports:
                    - "27017:27017"
                  restart: always
              EOT

              # Pull the images from Docker Hub and Start the App
              sudo docker compose up -d
              EOF

  tags = {
    Name = "DevOps-MERN-App"
  }
}

# 4. Output the Public IP so you can see it in Jenkins
output "public_ip" {
  value = aws_instance.app_server.public_ip
}