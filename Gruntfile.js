module.exports = function(grunt) { //configuracoes para o grunt
  grunt.initConfig({ //iniciando o grunt
    pkg: grunt.file.readJSON('package.json'), //lendo o arquivo que ir executar os comando do grunt 
    less: { // configuracoes do less
      development: { // ambiente de desenvolvimento (usuario primario)
        files: { //arquivos
          'dev/styles/main.css' : 'src/styles/main.less', //destino : origem 
        }
      },
      production: { //ambiente de producao (usuario final)
        options : { //opcoes 
          compress: true, //criar versao minificada do arquivo (compressao)
        },
        files: { //arquivos 
          'dist/styles/main.min.css' : 'src/styles/main.less', //destino : origem 
        }        
      }
    },
    watch: { //monitora as mudancas e compila o less 
      less: {
        files: ['src/styles/**/*.less'], //arquivos monitorados 
        tasks: ['less:development'], //tarefas monitoradas 
      },
      html: {
        files: ['src/index.html'],
        tasks: ['replace:dev'] //monitora as tarefas 
      }
    },
    replace: { //substiue arquivos 
      dev: {
        options: {
          patterns: [
            {
              match: 'ENDERECO_DO_CSS', 
              replacement: './styles/main.css' //substitue o endereco do match pelo arquivo 
            },
            {
              match: 'ENDERECO_DO_JS', 
              replacement: '../src/scripts/main.js' //substitue o endereco do match pelo arquivo 
            }
          ]
        },
        files: [
          {
            expand: true, //expandir
            flatten: true, //achatar
            src: ['src/index.html'], //arquivo origem
            dest: 'dev/' //destino 
          }
        ]
      },
      dist: {
        options: {
          patterns: [ //padroes
            {
              match: 'ENDERECO_DO_CSS',
              replacement: './styles/main.min.css' //substitue o endereco do match pelo arquivo 
            },
            {
              match: 'ENDERECO_DO_JS', 
              replacement: './scripts/main.min.js'
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ['prebuild/index.html'],
            dest: 'dist/'
          }
        ]
      }
    },
    htmlmin: { //minifica arquivos 
      dist: {
        options: {
          removeComments: true, //remove comentarios 
          collapseWhitespace: true, //remove espacos em branco
        },
        files: {
          'prebuild/index.html' : 'src/index.html' 
        }
      }
    },
    clean: ['prebuild'], //plugin que exclui arquivos (limpa)
    uglify: {
      target: {
        files: {
          'dist/scripts/main.min.js': 'src/scripts/main.js'
        }
      }
    }
  })

    //tarefas do grunt  
    grunt.loadNpmTasks('grunt-contrib-less'); //faz a juncao do grunt com o less (compilador)
    grunt.loadNpmTasks('grunt-contrib-watch'); //monitora os arquivos desejados e realiza modificacoes automaticas
    grunt.loadNpmTasks('grunt-replace'); //subtitue os arquivos desejados por outros 
    grunt.loadNpmTasks('grunt-contrib-htmlmin'); //minifica arquivos 
    grunt.loadNpmTasks('grunt-contrib-clean'); //exclui arquivos 
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['watch']);  // funcao padrao 'default' - entre os colchetes(array) podemos chamar quantas funcao desejarmos 
    grunt.registerTask('build', ['less:production', 'htmlmin:dist', 'replace:dist', 'clean', 'uglify']);

}
