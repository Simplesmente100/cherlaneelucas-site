# Réplica do site de casamento — Lucas e Cherlane

## Objetivo
Recriar em código próprio a experiência visual da página de referência, usando o conteúdo e as imagens públicas autorizadas do casal, sem iframe e sem serviços de pagamento nesta versão.

## Estrutura da página
- Navegação fixa no desktop e menu lateral no celular, com rolagem suave para cada seção.
- Abertura em tela cheia com a foto do casal, sobreposição escura, monograma floral, nomes e data.
- Texto de boas-vindas e citação.
- Contagem regressiva ao vivo para 19 de dezembro de 2026, às 17h.
- “Nossa história” com foto circular, texto do casal e galeria navegável com quatro fotos.
- Cerimônia e recepção com fotos, textos, data, endereço e links para abrir cada local no mapa.
- Lista de presentes responsiva, com ordenação, carrinho local demonstrativo e aviso claro de que o pagamento será disponibilizado futuramente.
- Confirmação de presença com todos os campos visuais da referência e confirmação local, sem envio para servidor.
- Formulário de recados com confirmação local, sem persistência.
- Rodapé discreto próprio do casal.

## Conteúdo editável
Criar um único arquivo de configuração contendo:
- nomes, iniciais, data e textos;
- links e endereços;
- todas as imagens;
- itens, valores e fotos dos presentes;
- opções de navegação e textos dos formulários.

## Aparência e interação
- Reproduzir a paleta branca e azul acinzentada, a tipografia manuscrita nos títulos e a tipografia limpa no restante.
- Usar as fotos públicas estáveis da referência, incluindo versões específicas para desktop e celular.
- Recriar o recorte de papel da abertura com CSS, sem copiar código do site original.
- Aplicar animações discretas de entrada, transições suaves, galeria com setas e indicadores, e estados acessíveis de foco.
- Garantir boa leitura, proporções e controles em celular e desktop.

## Organização técnica
- Separar cabeçalho, abertura, contagem, história/galeria, locais, presentes, formulários e rodapé em componentes reutilizáveis.
- Usar React, TypeScript, Tailwind e os controles existentes do projeto.
- Manter RSVP, recados e carrinho apenas no navegador nesta primeira versão, prontos para futura conexão com pagamentos e armazenamento.
- Adicionar título e descrição próprios para compartilhamento e busca.

## Validação
- Conferir a página no preview em desktop e celular.
- Testar menu, rolagem, contagem, galeria, ordenação/carrinho e confirmações dos formulários.
- Verificar ausência de sobreposição, cortes indevidos e erros no navegador.
