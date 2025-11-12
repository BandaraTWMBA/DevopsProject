pipeline {
  agent any

  environment {
    // Change these to match your Jenkins credentials ID & DockerHub username
    DOCKERHUB_CREDENTIALS = 'BandaraTWMBA'    // Jenkins Credentials ID (Username+Password or username+token)
    DOCKERHUB_USERNAME = 'budhathribandara'     // Docker Hub username (replace)
    CI_COMPOSE_FILE = 'docker-compose.ci.yml'    // CI-friendly compose file
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare') {
      steps {
        script {
          // Determine git short SHA for tagging
          IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          echo "Image tag: ${IMAGE_TAG}"

          // Find docker-compose (prefer 'docker compose', fallback to 'docker-compose')
          COMPOSE_CMD = sh(script: "command -v docker && docker compose version >/dev/null 2>&1 && echo 'docker compose' || (command -v docker-compose >/dev/null 2>&1 && echo 'docker-compose') || true", returnStdout: true).trim()
          if (!COMPOSE_CMD) {
            error "No docker compose binary found. Install docker-compose or ensure Docker CLI has 'docker compose'."
          }
          echo "Using compose command: ${COMPOSE_CMD}"
        }
      }
    }

    stage('Build Images') {
      steps {
        script {
          // Build using the CI compose file
          sh """
             set -e
             echo "Building images with ${COMPOSE_CMD}..."
             ${COMPOSE_CMD} -f ${CI_COMPOSE_FILE} build --parallel
          """
        }
      }
    }

    stage('Tag Images') {
      steps {
        script {
          // Tag the locally-built images (names must match compose images)
          sh """
            set -e
            echo "Tagging images with ${DOCKERHUB_USERNAME}/${IMAGE_TAG}..."
            docker tag health_backend ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG}
            docker tag health_backend ${DOCKERHUB_USERNAME}/health-backend:latest
            docker tag health_frontend ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG}
            docker tag health_frontend ${DOCKERHUB_USERNAME}/health-frontend:latest
          """
        }
      }
    }

    stage('Docker Login & Push') {
      steps {
        script {
          // Use Jenkins username/password credentials to login to Docker Hub
          withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
            sh """
              set -e
              echo "Logging in to Docker Hub as ${DOCKERHUB_USERNAME}..."
              echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin

              echo "Pushing backend images..."
              docker push ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG}
              docker push ${DOCKERHUB_USERNAME}/health-backend:latest

              echo "Pushing frontend images..."
              docker push ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG}
              docker push ${DOCKERHUB_USERNAME}/health-frontend:latest

              docker logout
            """
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ Build & push completed successfully"
    }
    failure {
      echo "❌ Build or push failed — check console logs"
    }
  }
}
