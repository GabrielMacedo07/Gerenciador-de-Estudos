package br.com.universidade.gerenciador_de_estudos.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private Integer idEvento;

    @Enumerated(EnumType.STRING)
    @Column(name = "dia_da_semana", nullable = true, length = 20)
    private DayOfWeek diaDaSemana;

    @Column(name = "hora", nullable = true)
    private LocalTime hora;

    @Column(name = "sala", nullable = true, length = 50)
    private String sala;

    @Column(name = "bloco", nullable = true, length = 50)
    private String bloco;

    @ManyToOne
    @JoinColumn(name = "id_materia", nullable = false)
    @JsonIgnore
    private Materia materia;

    public Integer getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(Integer idEvento) {
        this.idEvento = idEvento;
    }

    public DayOfWeek getDiaDaSemana() {
        return diaDaSemana;
    }

    public void setDiaDaSemana(DayOfWeek diaDaSemana) {
        this.diaDaSemana = diaDaSemana;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getSala() {
        return sala;
    }

    public void setSala(String sala) {
        this.sala = sala;
    }

    public String getBloco() {
        return bloco;
    }

    public void setBloco(String bloco) {
        this.bloco = bloco;
    }

    public Materia getMateria() {
        return materia;
    }

    public void setMateria(Materia materia) {
        this.materia = materia;
    }
}