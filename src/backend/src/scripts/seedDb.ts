import type { RowDataPacket } from "mysql2";

import { pool } from "../config/database.js";

type CountRow = RowDataPacket & { total: number };
type IdRow = RowDataPacket & { id: number; nome: string };
type StockRow = RowDataPacket & { id: number; nome: string; quantidade: number };

async function countRows(table: string) {
  const [rows] = await pool.query<CountRow[]>(`SELECT COUNT(*) AS total FROM ${table}`);
  return Number(rows[0]?.total ?? 0);
}

async function getIds(table: string) {
  const [rows] = await pool.query<IdRow[]>(`SELECT id, nome FROM ${table} ORDER BY id`);
  return rows;
}

async function seedUnidades() {
  if (await countRows("unidades")) return;

  await pool.query(
    "INSERT INTO unidades (nome, endereco, responsavel) VALUES ?",
    [[
      ["Matriz - Producao", "Rua das Padarias, 120", "Mariana Souza"],
      ["Loja Centro", "Avenida Principal, 845", "Carlos Henrique"],
      ["Quiosque Shopping", "Shopping Vila Norte, Piso 1", "Fernanda Lima"],
      ["Loja Bairro Jardim", "Rua das Acacias, 310", "Bianca Carvalho"],
      ["Centro de Distribuicao", "Avenida dos Galpoes, 75", "Roberto Dias"],
      ["Loja Vila Nova", "Rua Padre Miguel, 220", "Camila Teixeira"]
    ]]
  );
}

async function seedClientes() {
  if (await countRows("clientes")) return;

  await pool.query(
    "INSERT INTO clientes (nome, cpf, telefone, endereco) VALUES ?",
    [[
      ["Ana Paula Martins", "11122233344", "11988887777", "Rua das Flores, 45"],
      ["Bruno Ribeiro", "22233344455", "11977776666", "Avenida Brasil, 900"],
      ["Claudia Nascimento", "33344455566", "11966665555", "Rua do Mercado, 18"],
      ["Padaria Bom Dia Ltda", "44455566677", "1133332222", "Rua Comercial, 300"],
      ["Mercado Sao Jose", "55566677788", "1144443333", "Avenida Central, 70"],
      ["Renata Oliveira", "66677788899", "11955554444", "Rua das Palmeiras, 88"],
      ["Gustavo Almeida", "77788899900", "11944443333", "Rua XV de Novembro, 150"],
      ["Helena Costa", "88899900011", "11933332222", "Rua Aurora, 21"],
      ["Marcelo Araujo", "99900011122", "11922221111", "Avenida Paulista, 1000"],
      ["Luciana Barros", "00011122233", "11911110000", "Rua Sao Bento, 62"],
      ["Cafe Expresso Central", "10111213141", "1132109876", "Galeria Central, Loja 12"],
      ["Restaurante Villa Massa", "20212223242", "1145671234", "Rua Italia, 240"],
      ["Emporio Natural", "30313233343", "1156782345", "Avenida Verde, 444"],
      ["Hotel Primavera", "40414243444", "1167893456", "Rua das Hortensias, 15"],
      ["Condominio Sol Nascente", "50515253545", "1178904567", "Alameda Norte, 500"],
      ["Escola Pequenos Sabores", "60616263646", "1189015678", "Rua do Colegio, 33"],
      ["Clinica Bem Estar", "70717273747", "1190126789", "Avenida Saude, 777"],
      ["Mercadinho Popular", "80818283848", "1134567890", "Rua Popular, 90"],
      ["Sandra Menezes", "90919293949", "11976543210", "Rua das Violetas, 77"],
      ["Thiago Lopes", "12131415161", "11987654321", "Rua do Lago, 8"]
    ]]
  );
}

async function seedFornecedores() {
  if (await countRows("fornecedores")) return;

  await pool.query(
    "INSERT INTO fornecedores (nome, cnpj, contato, produtos_fornecidos) VALUES ?",
    [[
      ["Moinho Santa Clara", "12345678000110", "compras@moinhosantaclara.com", "Farinha de trigo"],
      ["Fermentos Brasil", "22345678000120", "vendas@fermentosbrasil.com", "Fermento biologico"],
      ["Embalagens Alfa", "32345678000130", "contato@embalagensalfa.com", "Sacos de papel e etiquetas"],
      ["Laticinios Serra", "42345678000140", "pedido@laticiniosserra.com", "Leite, manteiga e queijo"],
      ["Graos & Sementes", "52345678000150", "atendimento@graosesementes.com", "Gergelim, chia e linhaça"],
      ["Acucar Cristalino", "62345678000160", "comercial@acucarcristalino.com", "Acucar refinado e mascavo"],
      ["Chocolate da Serra", "72345678000170", "vendas@chocolatedaserra.com", "Chocolate, cacau e gotas"],
      ["Frutas Secas Aurora", "82345678000180", "pedido@frutassecasaurora.com", "Uvas passas, damasco e castanhas"],
      ["Equipamentos Padaria Pro", "92345678000190", "suporte@padariapro.com", "Fornos, batedeiras e pecas"],
      ["Higiene Total", "10345678000111", "atendimento@higienetotal.com", "Produtos de limpeza"],
      ["Ovos Granja Feliz", "11345678000112", "contato@granjafeliz.com", "Ovos e derivados"],
      ["Transportes Rapido Pao", "12345678000113", "logistica@rapidopao.com", "Entrega e distribuicao"]
    ]]
  );
}

async function seedFuncionarios() {
  if (await countRows("funcionarios")) return;

  const unidades = await getIds("unidades");
  if (unidades.length === 0) return;

  const matriz = unidades[0].id;
  const centro = unidades[1]?.id ?? matriz;
  const shopping = unidades[2]?.id ?? matriz;
  const jardim = unidades[3]?.id ?? matriz;
  const cd = unidades[4]?.id ?? matriz;
  const vila = unidades[5]?.id ?? matriz;

  await pool.query(
    "INSERT INTO funcionarios (nome, cpf, cargo, salario, data_admissao, unidade_id) VALUES ?",
    [[
      ["Joao Pedro Alves", "10120230344", "Padeiro", 2800.00, "2025-02-10", matriz],
      ["Larissa Gomes", "20230340455", "Atendente", 1900.00, "2025-03-01", centro],
      ["Rafael Moreira", "30340450566", "Auxiliar de Producao", 2100.00, "2025-04-15", matriz],
      ["Patricia Rocha", "40450560677", "Gerente de Loja", 3200.00, "2024-11-20", centro],
      ["Eduardo Nunes", "50560670788", "Atendente", 1850.00, "2025-06-05", shopping],
      ["Sabrina Mota", "60670780899", "Confeiteira", 2750.00, "2025-01-18", matriz],
      ["Paulo Henrique", "70780890910", "Motorista", 2400.00, "2025-05-12", cd],
      ["Marcos Vinicius", "80890901021", "Estoquista", 2300.00, "2024-12-03", cd],
      ["Aline Ferreira", "90901012132", "Atendente", 1880.00, "2025-02-25", jardim],
      ["Camila Torres", "01012123243", "Caixa", 1950.00, "2025-03-09", vila],
      ["Renan Castro", "12123234354", "Padeiro", 2950.00, "2024-10-01", matriz],
      ["Beatriz Campos", "23234345465", "Auxiliar de Limpeza", 1700.00, "2025-06-14", centro],
      ["Felipe Augusto", "34345456576", "Supervisor de Producao", 4100.00, "2024-08-10", matriz],
      ["Natalia Pires", "45456567687", "Atendente", 1900.00, "2025-04-22", shopping],
      ["Diego Santana", "56567678798", "Analista Administrativo", 3300.00, "2024-09-16", cd],
      ["Priscila Duarte", "67678789809", "Confeiteira", 2700.00, "2025-01-30", vila]
    ]]
  );
}

async function seedEstoque() {
  if (await countRows("estoque")) return;

  await pool.query(
    "INSERT INTO estoque (nome, tipo, quantidade, quantidade_minima, validade) VALUES ?",
    [[
      ["Farinha de trigo premium", "Insumo", 120.00, 30.00, "2026-12-20"],
      ["Fermento biologico seco", "Insumo", 35.00, 10.00, "2026-10-15"],
      ["Manteiga sem sal", "Insumo", 22.00, 8.00, "2026-08-05"],
      ["Pao artesanal tradicional", "Produto final", 48.00, 12.00, "2026-07-10"],
      ["Pao integral com sementes", "Produto final", 32.00, 10.00, "2026-07-10"],
      ["Embalagem kraft", "Material", 300.00, 80.00, null],
      ["Farinha integral", "Insumo", 85.00, 25.00, "2026-11-18"],
      ["Acucar mascavo", "Insumo", 42.00, 12.00, "2027-01-10"],
      ["Sal marinho", "Insumo", 18.00, 5.00, "2027-03-20"],
      ["Ovos", "Insumo", 240.00, 60.00, "2026-07-28"],
      ["Leite integral", "Insumo", 55.00, 15.00, "2026-07-22"],
      ["Chocolate meio amargo", "Insumo", 28.00, 8.00, "2026-12-01"],
      ["Gergelim branco", "Insumo", 14.00, 4.00, "2027-02-14"],
      ["Castanha do Para", "Insumo", 12.00, 3.00, "2027-01-25"],
      ["Uva passa", "Insumo", 16.00, 5.00, "2027-02-01"],
      ["Pao de queijo artesanal", "Produto final", 60.00, 20.00, "2026-07-09"],
      ["Croissant tradicional", "Produto final", 40.00, 15.00, "2026-07-09"],
      ["Brioche", "Produto final", 26.00, 8.00, "2026-07-08"],
      ["Focaccia de alecrim", "Produto final", 24.00, 8.00, "2026-07-08"],
      ["Baguete rustica", "Produto final", 34.00, 10.00, "2026-07-09"],
      ["Pao doce com creme", "Produto final", 45.00, 12.00, "2026-07-08"],
      ["Etiqueta validade", "Material", 500.00, 150.00, null],
      ["Caixa para entrega", "Material", 180.00, 50.00, null],
      ["Saco plastico transparente", "Material", 420.00, 100.00, null]
    ]]
  );
}

async function seedMovimentacoes() {
  if (await countRows("estoque_movimentacoes")) return;

  const [items] = await pool.query<StockRow[]>("SELECT id, nome, quantidade FROM estoque ORDER BY id");
  if (items.length === 0) return;

  const values = items.flatMap((item) => [
    [item.id, "entrada", item.quantidade, `Carga inicial de ${item.nome}`],
    [item.id, "saida", Math.max(1, Math.round(Number(item.quantidade) * 0.15)), `Uso ou venda inicial de ${item.nome}`]
  ]);

  await pool.query(
    "INSERT INTO estoque_movimentacoes (item_id, tipo, quantidade, observacao) VALUES ?",
    [values]
  );
}

async function seedFaturamentos() {
  if (await countRows("faturamentos")) return;

  await pool.query(
    "INSERT INTO faturamentos (descricao, valor, data_faturamento, forma_pagamento, observacao) VALUES ?",
    [[
      ["Venda diaria - loja centro", 1380.50, "2026-07-01", "Cartao", "Movimento de paes artesanais"],
      ["Pedido corporativo - cafe da manha", 890.00, "2026-07-02", "Pix", "Entrega para escritorio"],
      ["Venda quiosque shopping", 740.30, "2026-07-03", "Dinheiro", "Fluxo de fim de tarde"],
      ["Encomenda de paes integrais", 520.00, "2026-07-04", "Pix", "Cliente recorrente"],
      ["Venda semanal para mercado parceiro", 2150.00, "2026-07-05", "Boleto", "Pedido atacado"],
      ["Entrega para hotel", 1680.00, "2026-07-06", "Transferencia", "Cafe da manha corporativo"],
      ["Venda loja bairro jardim", 965.80, "2026-07-06", "Cartao", "Movimento loja bairro"],
      ["Pedido escola infantil", 430.00, "2026-07-07", "Pix", "Lanche coletivo"],
      ["Venda de croissants", 385.50, "2026-07-07", "Dinheiro", "Venda avulsa"],
      ["Pedido restaurante parceiro", 1240.00, "2026-07-08", "Boleto", "Fornecimento semanal"],
      ["Encomenda aniversario", 670.00, "2026-07-08", "Pix", "Kit paes e doces"],
      ["Venda loja centro", 1510.25, "2026-07-09", "Cartao", "Movimento diario"],
      ["Venda quiosque shopping", 830.75, "2026-07-09", "Cartao", "Movimento shopping"],
      ["Pedido condominio", 980.00, "2026-07-10", "Pix", "Entrega matinal"],
      ["Venda atacado mercadinho", 1890.00, "2026-07-10", "Boleto", "Reposicao semanal"],
      ["Venda paes especiais", 610.40, "2026-07-11", "Cartao", "Linha artesanal premium"],
      ["Pedido clinica bem estar", 320.00, "2026-07-11", "Pix", "Coffee break"]
    ]]
  );
}

async function seedEquipamentos() {
  if (await countRows("equipamentos")) return;

  await pool.query(
    "INSERT INTO equipamentos (nome, tipo, descricao, status) VALUES ?",
    [[
      ["Forno Turbo 01", "Forno", "Forno principal da producao", "Ativo"],
      ["Batedeira Industrial 20L", "Batedeira", "Usada para massas leves e medias", "Ativo"],
      ["Fermentadora Camara 01", "Fermentadora", "Controle de fermentacao natural", "Ativo"],
      ["Freezer Estoque", "Freezer", "Armazenamento de insumos refrigerados", "Ativo"],
      ["Forno Lastro 02", "Forno", "Forno para paes rusticos", "Ativo"],
      ["Divisora de Massa", "Divisora", "Equipamento para padronizar porcoes", "Ativo"],
      ["Modeladora de Paes", "Modeladora", "Modelagem de baguetes e paes longos", "Ativo"],
      ["Refrigerador Loja Centro", "Refrigerador", "Expositor refrigerado de loja", "Ativo"],
      ["Seladora de Embalagens", "Seladora", "Fechamento de embalagens kraft", "Ativo"],
      ["Cilindro Laminador", "Laminador", "Laminacao de massas folhadas", "Em manutencao"]
    ]]
  );
}

async function seedManutencoes() {
  if (await countRows("manutencoes")) return;

  const equipamentos = await getIds("equipamentos");
  if (equipamentos.length === 0) return;

  const forno = equipamentos[0].id;
  const batedeira = equipamentos[1]?.id ?? forno;
  const fermentadora = equipamentos[2]?.id ?? forno;
  const freezer = equipamentos[3]?.id ?? forno;
  const fornoLastro = equipamentos[4]?.id ?? forno;
  const divisora = equipamentos[5]?.id ?? forno;
  const modeladora = equipamentos[6]?.id ?? forno;
  const refrigerador = equipamentos[7]?.id ?? forno;
  const seladora = equipamentos[8]?.id ?? forno;
  const laminador = equipamentos[9]?.id ?? forno;

  await pool.query(
    "INSERT INTO manutencoes (equipamento_id, tipo, data_manutencao, responsavel_tecnico, custo, proxima_revisao, observacao) VALUES ?",
    [[
      [forno, "Preventiva", "2026-06-20", "Tecnico Marcos", 350.00, "2026-09-20", "Limpeza e calibragem"],
      [batedeira, "Corretiva", "2026-06-25", "Assistencia MixPro", 420.00, "2026-08-25", "Troca de correia"],
      [fermentadora, "Preventiva", "2026-07-02", "Tecnica Juliana", 280.00, "2026-10-02", "Verificacao de sensores"],
      [freezer, "Preventiva", "2026-07-05", "RefrigeraTech", 310.00, "2026-10-05", "Limpeza de condensador"],
      [fornoLastro, "Preventiva", "2026-07-08", "Tecnico Marcos", 390.00, "2026-10-08", "Ajuste de temperatura"],
      [divisora, "Corretiva", "2026-07-10", "Assistencia Padaria Pro", 520.00, "2026-09-10", "Substituicao de sensor"],
      [modeladora, "Preventiva", "2026-07-12", "Tecnica Juliana", 260.00, "2026-10-12", "Lubrificacao geral"],
      [refrigerador, "Corretiva", "2026-07-14", "RefrigeraTech", 610.00, "2026-08-14", "Troca de termostato"],
      [seladora, "Preventiva", "2026-07-15", "Embalagens Alfa Suporte", 180.00, "2026-10-15", "Teste de resistencia"],
      [laminador, "Corretiva", "2026-07-16", "Assistencia MixPro", 730.00, "2026-08-16", "Ajuste de roletes"]
    ]]
  );
}

async function resetDatabase() {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("TRUNCATE TABLE manutencoes");
  await pool.query("TRUNCATE TABLE equipamentos");
  await pool.query("TRUNCATE TABLE faturamentos");
  await pool.query("TRUNCATE TABLE estoque_movimentacoes");
  await pool.query("TRUNCATE TABLE estoque");
  await pool.query("TRUNCATE TABLE funcionarios");
  await pool.query("TRUNCATE TABLE fornecedores");
  await pool.query("TRUNCATE TABLE clientes");
  await pool.query("TRUNCATE TABLE unidades");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");
}

async function seedDatabase() {
  if (process.argv.includes("--reset")) {
    await resetDatabase();
  }
  await seedUnidades();
  await seedClientes();
  await seedFornecedores();
  await seedFuncionarios();
  await seedEstoque();
  await seedMovimentacoes();
  await seedFaturamentos();
  await seedEquipamentos();
  await seedManutencoes();
}

seedDatabase()
  .then(async () => {
    await pool.end();
    console.log(process.argv.includes("--reset") ? "Banco resetado e povoado com dados ficticios com sucesso." : "Banco de dados povoado com dados ficticios com sucesso.");
  })
  .catch(async (error: unknown) => {
    await pool.end();
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error(`Erro ao popular o banco: ${message}`);
    process.exit(1);
  });
