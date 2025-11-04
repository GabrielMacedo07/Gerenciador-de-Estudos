package br.com.universidade.gerenciador_de_estudos.service;

import br.com.universidade.gerenciador_de_estudos.dto.EstatisticaNotaDTO;
import br.com.universidade.gerenciador_de_estudos.model.Usuario;
import br.com.universidade.gerenciador_de_estudos.repository.NotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstatisticaService {

    @Autowired
    private NotaRepository notaRepository;

    public List<EstatisticaNotaDTO> getMediaNotasPorMateria() {

        Usuario usuarioLogado = getUsuarioLogado();

        return notaRepository.findMediaNotasPorMateriaDoUsuario(usuarioLogado.getIdUsuario());
    }

    private Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Nenhum usuário autenticado encontrado.");
        }
        return (Usuario) authentication.getPrincipal();
    }
}