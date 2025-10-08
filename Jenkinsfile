pipeline {
    agent any

    stages {
       stage('Clone') {
    steps {
        git branch: 'main', url: 'https://github.com/prasannat05/MapMoments.git'
    }
}

        stage('Build') {
            steps {
                echo 'Building...'
                // Replace with your build command, e.g., ./gradlew build
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                // e.g., ./gradlew test or npm test
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // e.g., scp, docker push, etc.
            }
        }
    }
}
