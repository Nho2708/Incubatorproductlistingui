pipeline {
    agent any

    tools {
        nodejs 'Node 20'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.BRANCH_NAME}"
                echo "Commit: ${env.GIT_COMMIT}"
            }
        }

        stage('Install') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
                echo "Build thanh cong! Output o thu muc build/"
            }
        }

        stage('Deploy') {
            steps {
                echo "=== Deploy len IIS ==="
                bat '''
                    robocopy build "C:\\inetpub\\wwwroot\\IncubatorProductListingUI" /MIR /Z /W:5 /R:3
                    IF %ERRORLEVEL% LEQ 3 EXIT 0
                '''
                echo "Deploy thanh cong!"
            }
        }
    }

    post {
        success {
            echo "Pipeline thanh cong!"
        }
        failure {
            echo "Pipeline that bai!"
        }
    }
}
