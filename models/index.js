const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const Categoria = sequelize.define('Categoria', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

const Produto = sequelize.define('Produto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

// Relacionamento 1:N — uma categoria possui vários produtos.
// Isso cria a chave estrangeira "categoriaId" na tabela Produtos.
Categoria.hasMany(Produto, { foreignKey: 'categoriaId', as: 'produtos' });
Produto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });

module.exports = {
  sequelize,
  Categoria,
  Produto
};
