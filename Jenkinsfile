pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo "🔍 Cloning repository..."
                checkout scm
                sh 'pwd && ls -la'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🔨 Building Docker image..."
                sh 'docker build -t imvishalbhargav/drinkit-app:latest .'
                sh 'docker images | grep drinkit'
            }
        }

        stage('Docker Push') {
            steps {
                echo "📤 Pushing to Docker Hub..."
                sh '''
                    docker login -u imvishalbhargav -p ${DOCKER_PASSWORD}
                    docker push imvishalbhargav/drinkit-app:latest
                    docker logout
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline SUCCESS!"
        }
        failure {
            echo "❌ Pipeline FAILED!"
        }
    }
}
