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

        echo "Tagging backend image..."
        docker tag health_backend:latest ${DOCKERHUB_USERNAME}/health_backend:${IMAGE_TAG}
        docker tag health_backend:latest ${DOCKERHUB_USERNAME}/health_backend:latest

        echo "Tagging frontend image..."
        docker tag health_frontend:latest ${DOCKERHUB_USERNAME}/health_frontend:${IMAGE_TAG}
        docker tag health_frontend:latest ${DOCKERHUB_USERNAME}/health_frontend:latest

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
              docker push ${DOCKERHUB_USERNAME}/healthbackend:${IMAGE_TAG} || true
              docker push ${DOCKERHUB_USERNAME}/health_backend:latest || true

              echo "Pushing frontend images..."
              docker push ${DOCKERHUB_USERNAME}/health_frontend:${IMAGE_TAG} || true
              docker push ${DOCKERHUB_USERNAME}/health_frontend:latest || true

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
