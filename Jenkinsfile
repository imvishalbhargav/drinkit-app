pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "imvishalbhargav"  // CHANGE THIS TO YOUR DOCKER HUB USERNAME
        DOCKER_IMAGE = "${DOCKER_HUB_USER}/drinkit-app"
        DOCKER_TAG = "${BUILD_NUMBER}"
        REGISTRY_CREDENTIALS = credentials('dockerhub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                echo "🔍 Cloning repository..."
                checkout scm
                sh 'git log --oneline -1'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🔨 Building Docker image..."
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                echo "✅ Docker image built successfully!"
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo "🔑 Logging in to Docker Hub..."
                sh '''
                    echo $REGISTRY_CREDENTIALS_PSW | docker login -u $REGISTRY_CREDENTIALS_USR --password-stdin
                    echo "✅ Docker Hub login successful!"
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "📤 Pushing image to Docker Hub..."
                sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh "docker push ${DOCKER_IMAGE}:latest"
                echo "✅ Image pushed successfully!"
                echo "📍 Image: ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }

        stage('Cleanup') {
            steps {
                echo "🧹 Cleaning up..."
                sh "docker logout"
                sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
                echo "✅ Cleanup complete!"
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline SUCCESS! 🎉"
            echo "📍 Image available at: ${DOCKER_IMAGE}:${DOCKER_TAG}"
            echo "🌐 Docker Hub: https://hub.docker.com/r/${DOCKER_IMAGE}"
        }
        failure {
            echo "❌ Pipeline FAILED!"
        }
    }
}
