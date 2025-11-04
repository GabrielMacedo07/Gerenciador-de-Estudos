package br.com.universidade.gerenciador_de_estudos.repository;

import br.com.universidade.gerenciador_de_estudos.dto.EstatisticaNotaDTO;
import br.com.universidade.gerenciador_de_estudos.model.Materia;
import br.com.universidade.gerenciador_de_estudos.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {

    List<Nota> findByMateria(Materia materia);

    @Query("""
        SELECT new br.com.universidade.gerenciador_de_estudos.dto.EstatisticaNotaDTO(
            m.nomeMateria, 
            AVG(n.valor)
        ) 
        FROM Nota n 
        JOIN n.materia m 
        JOIN m.usuario u
        WHERE u.idUsuario = :idUsuario 
        GROUP BY m.nomeMateria
    """)
    List<EstatisticaNotaDTO> findMediaNotasPorMateriaDoUsuario(Integer idUsuario);

}
