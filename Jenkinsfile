pipeline {
    environment { 
        registryCredential = 'dockerhub-jenkins' 
        dockerImage = '' 
    }
    agent any

    stages {
        stage('Step 1: Git Pull') {
            steps {
               git url: 'https://github.com/akilalakshmanan/caffeine_confessions_backend.git'
            }
        }
        
        stage('Step 2: Testing'){
            steps{
                script{
                    sh 'npm test'
                }
            }
        }
        
        stage('Step 3: Build docker image') 

            { 
                steps{ 
                    script{ 
                        dockerImage = docker.build 'akila1811/node-image'  

                    } 
                } 
            } 
            
        stage('Step 4: Push docker image')
            {
                steps{
                    script {  
                       docker.withRegistry('',registryCredential) { 
                           dockerImage.push() 
                       }
                    }
                }
            }
        
        stage('Step 5: Ansible deployment')
            {
                steps{
                    ansiblePlaybook colorized: true, disableHostKeyChecking: true, installation: 'Ansible', inventory: 'inventory', playbook: 'deployment-playbook.yml'
                }
            }
            
            
    }
}
