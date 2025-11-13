pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'BandaraTWMBA'
    DOCKERHUB_USERNAME = 'budhathribandara'
    CI_COMPOSE_FILE = 'docker-compose.yml'   // <<-- point to the actual file
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Debug workspace') {
      steps {
        sh '''
          echo "WORKSPACE: $WORKSPACE"
          pwd
          ls -la
          echo "Show the compose file (if present):"
          if [ -f "$CI_COMPOSE_FILE" ]; then echo "FOUND $CI_COMPOSE_FILE"; else echo "MISSING $CI_COMPOSE_FILE"; fi
        '''
      }
    }

    stage('Prepare') {
      steps {
        script {
          IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          echo "Image tag: ${IMAGE_TAG}"

          // Pick compose command: prefer "docker compose" builtin, fallback to docker-compose
          COMPOSE_CMD = sh(script: "if docker compose version >/dev/null 2>&1; then echo 'docker compose'; elif command -v docker-compose >/dev/null 2>&1; then echo 'docker-compose'; else echo ''; fi", returnStdout: true).trim()
          if (!COMPOSE_CMD) {
            error "No docker compose available. Install docker-compose or ensure Docker CLI supports 'docker compose'."
          }
          echo "Using compose command: ${COMPOSE_CMD}"
        }
      }
    }

    stage('Check compose file') {
      steps {
        script {
          if (!fileExists("${CI_COMPOSE_FILE}")) {
            error "Compose file '${CI_COMPOSE_FILE}' not found in workspace. Make sure it is committed or update CI_COMPOSE_FILE to the correct path."
          }
        }
      }
    }

    stage('Build Images') {
      steps {
        script {
          sh """
            set -e
            echo "Building images with ${COMPOSE_CMD} -f ${CI_COMPOSE_FILE}..."
            ${COMPOSE_CMD} -f ${CI_COMPOSE_FILE} build --parallel
          """
        }
      }
    }

    // ... remaining Tag/Push stages unchanged ...
  }

  post {
    success { echo "✅ Build & push completed successfully" }
    failure { echo "❌ Build or push failed — check console logs" }
  }
}
