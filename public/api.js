const cadastro = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/cadastro"); // URL do backend
      if (!response.ok) {
        throw new Error("Erro ao buscar os dados.");
      }
      const data = await response.json(); // Parse dos dados recebidos
      setDocentes(data); // Atualiza o estado com os dados
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  fetchDocentes();
