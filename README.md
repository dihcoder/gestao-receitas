# Gestão de Receitas de Padaria

Bem-vindo ao sistema de **Gestão de Receitas de Padaria**\! Esta é uma aplicação web simples e intuitiva, desenvolvida para auxiliar padeiros e confeiteiros a organizar, visualizar e gerenciar suas receitas de forma eficiente. Com suporte a persistência de dados no navegador e funcionalidade de arrastar e soltar (drag-and-drop) para ordenação, a ferramenta se adapta perfeitamente ao uso diário, inclusive em dispositivos móveis.

-----

## ✨ Funcionalidades

  * **Adicionar Receitas**: Crie novas receitas com nome, múltiplos ingredientes, passos de preparação e observações opcionais.
  * **Visualizar Detalhes**: Clique em qualquer receita da lista para ver seus ingredientes e passos detalhados.
  * **Marcar Itens Concluídos**: Marque ingredientes e passos de preparação como concluídos com checkboxes interativos.
  * **Editar Receitas**: Modifique receitas existentes a qualquer momento.
  * **Excluir Receitas**: Remova receitas que não são mais necessárias.
  * **Busca Inteligente**: Encontre receitas rapidamente usando a barra de busca, que ignora acentos e capitalização para facilitar a pesquisa.
  * **Ordenação por Drag-and-Drop**: Organize suas receitas na ordem que preferir usando a funcionalidade de arrastar e soltar, com uma alça específica para evitar arrastes acidentais. A ordem é salva automaticamente\!
  * **Persistência de Dados**: Todas as suas receitas são salvas diretamente no navegador (via `localStorage`), garantindo que seus dados permaneçam mesmo após fechar a aplicação.
  * **Exportar/Importar Dados**: Faça backup das suas receitas ou compartilhe-as exportando para um arquivo JSON, e importe-as de volta quando precisar.
  * **Resetar Ordem Padrão**: Um botão dedicado permite restaurar a lista de receitas para uma ordem inicial predefinida, útil para começar do zero ou reorganizar rapidamente.
  * **Voltar ao Topo**: Um botão flutuante conveniente aparece quando você rola a página para baixo, permitindo um retorno rápido ao topo da lista.
  * **Responsivo**: Design otimizado para funcionar bem em diferentes tamanhos de tela, de desktops a dispositivos móveis.

-----

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com tecnologias web padrão, priorizando a simplicidade e a performance:

  * **HTML5**: Estrutura da página.
  * **CSS3 (com Tailwind CSS)**: Estilização e layout responsivo.
  * **JavaScript (Vanilla JS)**: Lógica da aplicação e manipulação do DOM.
  * **Sortable.js**: Biblioteca leve para a funcionalidade de arrastar e soltar.
  * **Font Awesome**: Ícones para melhor usabilidade (ex: alça de arrastar, voltar ao topo).

-----

## 🚀 Como Executar o Projeto Localmente

Para rodar este projeto em sua máquina:

1.  **Clone o Repositório**:
    ```bash
    git clone https://github.com/dihcoder/gestao-receitas.git
    ```
2.  **Navegue até o Diretório do Projeto**:
    ```bash
    cd gestao-receitas
    ```
3.  **Abra o `index.html`**:
    Simplesmente abra o arquivo `index.html` em seu navegador web preferido. Não é necessário um servidor web para as funcionalidades básicas, pois todos os dados são gerenciados via `localStorage`.

-----

## 💡 Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests se tiver sugestões de melhoria ou encontrar algum bug.

-----