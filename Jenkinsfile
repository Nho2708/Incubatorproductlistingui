pipeline {
    agent any

    environment {
        NODE_OPTIONS = '--max-old-space-size=4096'
        DEPLOY_DIR = 'C:\\inetpub\\wwwroot\\CustomerUI'
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
                bat '"C:\\Program Files\\nodejs\\npm.cmd" install'
            }
        }

        stage('Build') {
            steps {
                bat '"C:\\Program Files\\nodejs\\npm.cmd" run build'
                echo "Build thanh cong! Output o thu muc build/"
            }
        }

        stage('Deploy') {
            steps {
                echo "=== Deploy len IIS ==="
                bat """
                    robocopy build "%DEPLOY_DIR%" /MIR /Z /W:5 /R:3
                    IF %ERRORLEVEL% LEQ 3 EXIT 0
                """
                echo "Deploy thanh cong!"
            }
        }
    }

    post {
        success {
            echo "Pipeline thanh cong! Branch: ${env.BRANCH_NAME}"
        }
        failure {
            echo "Pipeline that bai! Kiem tra log o tren."
        }
    }
}
