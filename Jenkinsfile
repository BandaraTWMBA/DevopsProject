pipeline {
  agent any

  environment {
    // Replace with the Jenkins credential ID that contains your Docker Hub username+password/token
    DOCKERHUB_CREDENTIALS = 'BandaraTWMBA'  
    DOCKERHUB_USERNAME = 'budhathribandara'
    CI_COMPOSE_FILE = 'docker-compose.ci.yml' // change if your CI compose file has a different name/path
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Set image tag & detect compose') {
      steps {
        script {
          // compute IMAGE_TAG at runtime
          IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          echo "IMAGE_TAG -> ${IMAGE_TAG}"

          // choose compose command available on the agent
          COMPOSE_CMD = sh(script: """
            if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
              echo "docker compose"
            elif command -v docker-compose >/dev/null 2>&1; then
              echo "docker-compose"
            else
              echo ""
            fi
          """, returnStdout: true).trim()

          if (!COMPOSE_CMD) {
            error "No docker compose binary found on agent (neither 'docker compose' nor 'docker-compose')."
          }
          echo "Using compose command: ${COMPOSE_CMD}"
        }
      }
    }

    stage('Build images') {
      steps {
        script {
          // build using the chosen compose and the CI compose file
          sh """
            set -e
            echo "PWD: \$(pwd)"
            ${COMPOSE_CMD} -f ${CI_COMPOSE_FILE} build --parallel
          """
        }
      }
    }

    stage('Show local images (debug)') {
      steps {
        sh '''
          echo "=== Local images after build ==="
          docker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.ID}}"
        '''
      }
    }

    stage('Tag images for Docker Hub') {
      steps {
        script {
          // Tag the images that are actually built by your compose file.
          // Replace these source image names if your compose defines different image names.
          sh """
            set -e
            echo "Tagging images..."
            # These source names must match the 'image:' names in your docker-compose.yml or what was produced by build
            docker tag health_backend ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG} || true
            docker tag health_backend ${DOCKERHUB_USERNAME}/health-backend:latest || true
            docker tag health_frontend ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG} || true
            docker tag health_frontend ${DOCKERHUB_USERNAME}/health-frontend:latest || true

            echo "Images after tagging:"
            docker images --format "table {{.Repository}}\\t{{.Tag}}\\t{{.ID}}"
          """
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          // Use docker.withRegistry; ensure DOCKERHUB_CREDENTIALS is a Docker Hub username+password or token credential
          docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
            sh """
              set -e
              echo "Pushing ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG}"
              docker push ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG}
              echo "Pushing ${DOCKERHUB_USERNAME}/health-backend:latest"
              docker push ${DOCKERHUB_USERNAME}/health-backend:latest || true

              echo "Pushing ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG}"
              docker push ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG}
              echo "Pushing ${DOCKERHUB_USERNAME}/health-frontend:latest"
              docker push ${DOCKERHUB_USERNAME}/health-frontend:latest || true
            """
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ Build & push completed. Check Docker Hub ${DOCKERHUB_USERNAME} for repos 'health-backend' and 'health-frontend'."
    }
    failure {
      echo "❌ Pipeline failed — inspect console output for errors."
    }
  }
}
