
import db from '../config/db.js'; // Importa a conexão com o banco
import jwt from 'jsonwebtoken';

// ------------------------ ROTAS POST ------------------------
export const addCurso = async (req, res) => {
    const { nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim } = req.body;
    try {
        const [duplicidade] = await db.query(
            'SELECT * FROM curso WHERE nome = ? AND turma = ? AND data_inicio = ? AND data_fim = ?',
            [nome, turma, data_inicio, data_fim]
        );
        if (duplicidade.length > 0) {
            return res.status(400).send('Curso duplicado.');
        }
        const [resultado] = await db.execute(
            `INSERT INTO curso (nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, matriculas_previstas, turno, ch_total, modalidade, financiamento, localidade, turma, data_inicio, data_fim]
        );
        return res.status(201).send('Curso adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

export const addDocente = async (req, res) => {
    const { matricula, nome, email, telefone } = req.body;
    const senha = "000000";
    const setor = "docente";
    try {
        const [resultado] = await db.execute(
            `INSERT INTO docente (matricula, nome, email, senha, setor, telefone) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [matricula, nome, email, senha, setor, telefone]
        );
        return res.status(201).send('Docente adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

//inserir kit didático
// 3. Inserir kit didatico

export const adicionar_kit = async (req, res) => {
    const { cod_kit, nome_kit, cod_produto, descricao, quantidade, unidade_medida, saldo, curso } = req.body;
    try {
        const [duplicidade] = await db.query(
            'SELECT* FROM kit WHERE cod_kit = ? AND nome_kit = ? AND cod_produto = ? AND descricao = ? AND quantidade = ? AND unidade_medida = ? AND saldo = ? AND curso = ?', [cod_kit, nome_kit, cod_produto, descricao, quantidade, unidade_medida, saldo, curso]
        );
        if (duplicidade.length > 0) {
            return res.status(400).send('Kit já existe');
        }

        const [resultado] = await db.execute(
            `INSERT INTO kit (cod_kit, nome_kit, cod_produto, descricao, quantidade, unidade_medida, saldo, curso) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [cod_kit, nome_kit, cod_produto, descricao, quantidade, unidade_medida, saldo, curso]
        );
        return res.status(201).send('Kit adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

export const addMateriais = async (req, res) => {
    const { cod_produto, descricao, quantidade, unidade_medida, cod_kit, nome_kit, id_curso, nome_curso } = req.body;

    try {
        const [duplicidade] = await db.query(
            `SELECT * FROM materiais WHERE cod_produto = ? AND descricao = ? AND quantidade = ? AND unidade_medida = ? AND 
            cod_kit = ? AND nome_kit = ? AND id_curso = ? AND nome_curso = ?`, 
            [cod_produto, descricao, quantidade, unidade_medida, cod_kit, nome_kit, id_curso, nome_curso]
        );
        if (duplicidade.length > 0) {
            return res.status(400).send('Material já existe');
        }
        const [resultado] = await db.query(
            `INSERT INTO materiais (cod_produto, descricao, quantidade, unidade_medida, cod_kit, nome_kit, id_curso, nome_curso) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [cod_produto, descricao, quantidade, unidade_medida, cod_kit, nome_kit, id_curso, nome_curso]
        );
        return res.status(200).send('Material adicionado com sucesso.');                 
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

// ------------------------ ROTAS GET ------------------------
export const buscarCursos = async (req, res) => {
    try {
        const [resultado] = await db.execute('SELECT * FROM curso');
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

export const buscarCursosVigentes = async (req, res) => {
    try {
        await db.execute('CALL AtualizarCursosVigentes()');
        const [resultado] = await db.execute('SELECT * FROM cursos_vigentes');
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.o', error);
        return res.status(500).send('Erro ao processar a requisiçãoo.');
    }
};

export const buscarCursosConcluidos = async (req, res) => {
    try {
        await db.execute('CALL AtualizarCursosConcluidos()'); // oque é isso elaine?
        const [resultado] = await db.execute('SELECT * FROM cursos_concluidos');
        console.log(resultado);
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};




export const buscarDocentes = async (req, res) => {
    try {
        const [resultado] = await db.execute(
            `SELECT id, matricula, nome, email, telefone FROM docente`
        );
        return res.json(resultado);
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

// VISUALIZAR KIT DIDÁTICOS

export const buscarKitCoordenacao = async (req, res) => {
    try {
        const [result] = await db.query('SELECT cod_kit, nome_kit, tipo, curso FROM kit')

    // Verifica se o array está vazio ou indefinido
    if (result.length === 0) {
        return res.status(404).json({ message: 'Não há materiais para o kit.' });
      }
  // Retorna os kits encontrados
      console.log(result); // Mostra todos os kits no console
      return res.status(200).json(result); // Retorna o array completo no response
    } catch(error) { 
        console.error('ERRO ENCONTRADO: ', error);
        res.status(500).json({message: 'Erro'})
    }
};



// ------------------------ ROTAS DELETE ------------------------
export const delDocente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send('ID do docente é necessário.');
        }
        const [resultado] = await db.execute('DELETE FROM docente WHERE id = ?', [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).send('Docente não encontrado.');
        }
        return res.status(200).json({ message: 'Docente deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

export const delCursoVigente = async (req, res) => {
    try {
        const { id_curso } = req.params;
        if (!id_curso) {
            return res.status(400).send('ID do curso é necessário.');
        }
        const [resultado] = await db.execute('DELETE FROM cursos_vigentes WHERE id_curso = ?', [id_curso]);
        if (resultado.affectedRows === 0) {
            return res.status(404).send('Curso vigente não encontrado.');
        }
        return res.status(200).json({ message: 'Curso vigente deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao processar a requisição.', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};

// ------------------------ EXPORTAÇÃO ------------------------
