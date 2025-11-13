pipeline {
  agent any

  environment {
    // Jenkins credentials & Docker Hub username
    DOCKERHUB_CREDENTIALS = 'github_pat'
    DOCKERHUB_USERNAME    = 'budhathribandara'
    CI_COMPOSE_FILE       = 'docker-compose.yml'
  }

  parameters {
    booleanParam(name: 'PUSH_IMAGES', defaultValue: true, description: 'If true, tag & push images to Docker Hub')
    string(name: 'IMAGE_TAG', defaultValue: '', description: 'Optional image tag (defaults to git short SHA)')
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Prepare') {
      steps {
        script {
          env.IMAGE_TAG = params.IMAGE_TAG?.trim() ? params.IMAGE_TAG : sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          echo "Using IMAGE_TAG = ${env.IMAGE_TAG}"

          env.COMPOSE_CMD = sh(script: """
            if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
              echo "docker compose"
            elif command -v docker-compose >/dev/null 2>&1; then
              echo "docker-compose"
            else
              echo ""
            fi
          """, returnStdout: true).trim()

          if (!env.COMPOSE_CMD) { error "No docker compose binary found." }
          echo "Compose command: ${env.COMPOSE_CMD}"
        }
      }
    }

    stage('Build Images') {
      steps {
        script {
          sh """
            set -euo pipefail
            echo "Building images from ${CI_COMPOSE_FILE}..."
            ${env.COMPOSE_CMD} -f ${CI_COMPOSE_FILE} build --parallel
          """
        }
      }
    }

    stage('Tag Images') {
      steps {
        script {
          sh """
            set -euo pipefail

            # Detect backend image
            BACKEND_SRC=\$(docker ps -a --filter "name=health_backend_ci" --format '{{.Image}}' | head -n1 || true)
            if [ -z "\$BACKEND_SRC" ]; then
              BACKEND_SRC=\$(docker images --format '{{.Repository}}:{{.Tag}}' | grep '^health_backend' | head -n1)
            fi
            if [ -z "\$BACKEND_SRC" ]; then
              echo "ERROR: backend image not found!"
              docker images
              exit 1
            fi
            echo "Backend image detected: \$BACKEND_SRC"
            docker tag "\$BACKEND_SRC" ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG}
            docker tag "\$BACKEND_SRC" ${DOCKERHUB_USERNAME}/health-backend:latest

            # Detect frontend image
            FRONTEND_SRC=\$(docker ps -a --filter "name=health_frontend_ci" --format '{{.Image}}' | head -n1 || true)
            if [ -z "\$FRONTEND_SRC" ]; then
              FRONTEND_SRC=\$(docker images --format '{{.Repository}}:{{.Tag}}' | grep '^health_frontend' | head -n1)
            fi
            if [ -z "\$FRONTEND_SRC" ]; then
              echo "ERROR: frontend image not found!"
              docker images
              exit 1
            fi
            echo "Frontend image detected: \$FRONTEND_SRC"
            docker tag "\$FRONTEND_SRC" ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG}
            docker tag "\$FRONTEND_SRC" ${DOCKERHUB_USERNAME}/health-frontend:latest

            echo "✅ Tagging complete."
          """
        }
      }
    }

    stage('Docker Login & Push') {
      when { expression { return params.PUSH_IMAGES } }
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
            sh """
              set -euo pipefail
              echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin

              echo "Pushing backend images..."
              docker push ${DOCKERHUB_USERNAME}/health-backend:${IMAGE_TAG} || true
              docker push ${DOCKERHUB_USERNAME}/health-backend:latest || true

              echo "Pushing frontend images..."
              docker push ${DOCKERHUB_USERNAME}/health-frontend:${IMAGE_TAG} || true
              docker push ${DOCKERHUB_USERNAME}/health-frontend:latest || true

              docker logout || true
            """
          }
        }
      }
    }
  }

  post {
    always {
      script {
        sh """
          set -euo pipefail || true
          echo "Tearing down compose stack..."
          ${env.COMPOSE_CMD} -f ${CI_COMPOSE_FILE} down --volumes --remove-orphans || true
        """
      }
    }

    success { echo "✅ Pipeline completed successfully" }
    failure { echo "❌ Pipeline failed — check logs above" }
  }
}
