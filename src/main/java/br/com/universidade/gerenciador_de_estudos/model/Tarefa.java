package br.com.universidade.gerenciador_de_estudos.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate; // Para o dia de entrega
import java.time.LocalTime; // Para a hora do evento

@Entity
@Table(name = "tarefa") // Nome da tabela no banco
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarefa")
    private Integer idTarefa;

    @Column(name = "tema", nullable = false, length = 255)
    private String tema;

    @Column(name = "pagina", length = 50)
    private String pagina; // Ex: "p. 45" ou "Cap. 3"

    @Column(name = "dia_entrega", nullable = true)
    private LocalDate diaEntrega;

    @Column(name = "hora", nullable = true)
    private LocalTime hora;

    @Column(name = "concluido")
    private boolean concluido;

    @ManyToOne
    @JoinColumn(name = "id_materia", nullable = false)
    @JsonIgnore
    private Materia materia;

    @PrePersist
    protected void onCreate() {
        concluido = false;
    }

    public Integer getIdTarefa() {
        return idTarefa;
    }

    public void setIdTarefa(Integer idTarefa) {
        this.idTarefa = idTarefa;
    }

    public String getTema() {
        return tema;
    }

    public void setTema(String tema) {
        this.tema = tema;
    }

    public String getPagina() {
        return pagina;
    }

    public void setPagina(String pagina) {
        this.pagina = pagina;
    }

    public LocalDate getDiaEntrega() {
        return diaEntrega;
    }

    public void setDiaEntrega(LocalDate diaEntrega) {
        this.diaEntrega = diaEntrega;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public boolean isConcluido() {
        return concluido;
    }

    public void setConcluido(boolean concluido) {
        this.concluido = concluido;
    }

    public Materia getMateria() {
        return materia;
    }

    public void setMateria(Materia materia) {
        this.materia = materia;
    }
}
