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
  region = "us-east-1" 
}

# --- NEW: AUTO-SEARCH FOR UBUNTU AMI ---
# This block asks AWS: "What is the latest ID for Ubuntu 22.04?"
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (The company that makes Ubuntu)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "web_sg" {
  name        = "devops-project-sg-2"
  description = "Allow HTTP, Backend, and SSH traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app_server" {
  # --- UPDATED: USE THE FOUND ID ---
  ami           = data.aws_ami.ubuntu.id 
  instance_type = "t3.micro"            # Kept as medium for safety
  key_name      = "devops-key"          # Your key name from the logs

  vpc_security_group_ids = [aws_security_group.web_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo apt-get install -y docker-compose-plugin

              mkdir -p /home/ubuntu/app
              cd /home/ubuntu/app

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

              sudo docker compose up -d
              EOF

  tags = {
    Name = "DevOps-MERN-App"
  }
}

output "public_ip" {
  value = aws_instance.app_server.public_ip
}