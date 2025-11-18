package br.com.universidade.gerenciador_de_estudos.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "Usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "curso", nullable = true, length = 100)
    private String curso;

    @Column(name = "periodo_atual", nullable = true, length = 20)
    private String periodoAtual;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @JsonIgnore
    @Column(name = "senha", nullable = false, length = 255)
    private String senha;

    @Column(name = "idade", nullable = true)
    private Integer idade;

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }
    public String getPeriodoAtual() { return periodoAtual; }
    public void setPeriodoAtual(String periodoAtual) { this.periodoAtual = periodoAtual; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }

}