pipeline {
    agent any

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
                bat '''
                    robocopy build "C:\\inetpub\\wwwroot\\CustomerUI" /MIR /Z /W:5 /R:3
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
