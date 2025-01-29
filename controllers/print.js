import db from '../config/db.js';
//GET
export const getAssinaturas = async (req, res) => {
    try {
        const [resultado] = await db.execute(`
            SELECT id, nome, setor, signature_image 
            FROM docente 
            WHERE id = 16
            UNION ALL
            SELECT id, nome, setor, signature_image 
            FROM cadastro 
            WHERE id IN (45, 46, 47);
        `);

        if (resultado.length === 0) {
            return res.status(404).json({ message: 'Não há assinaturas disponíveis.' });
        }

        console.log(resultado); // Exibe o resultado no console para depuração

        return res.json(resultado); // Retorna o resultado como resposta JSON
    } catch (error) {
        console.error('Erro ao buscar assinaturas:', error);
        return res.status(500).send('Erro ao processar a requisição.');
    }
};
