package br.com.universidade.gerenciador_de_estudos.repository;

import br.com.universidade.gerenciador_de_estudos.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MateriaRepository extends JpaRepository<Materia, Integer> {

}
