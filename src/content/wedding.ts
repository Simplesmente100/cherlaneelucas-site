import heroDesktop from "@/assets/wedding/hero-desktop.jpg.asset.json";
import heroMobile from "@/assets/wedding/hero-mobile.jpg.asset.json";
import storyPortrait from "@/assets/wedding/story.jpg.asset.json";
import gallery1 from "@/assets/wedding/gallery-1.jpg.asset.json";
import gallery2 from "@/assets/wedding/gallery-2.jpg.asset.json";
import gallery3 from "@/assets/wedding/gallery-3.jpg.asset.json";
import gallery4 from "@/assets/wedding/gallery-4.jpg.asset.json";
import ceremonyPhoto from "@/assets/wedding/ceremony.jpg.asset.json";
import receptionPhoto from "@/assets/wedding/reception.jpg.asset.json";

const giftBase = "https://cdn-assets-legacy.casar.com/thumb/208x208x1/dados/sitenoivos/wed1096305/presentes";
const catalogGiftBase = "https://cdn-assets-legacy.casar.com/thumb/208x208x1/img/presentes";

export const wedding = {
  couple: { first: "Lucas", second: "Cherlane", initials: "L · C" },
  dateLabel: "19 | 12 | 2026",
  dateISO: "2026-12-19T17:00:00-03:00",
  hero: { desktop: heroDesktop.url, mobile: heroMobile.url },
  navigation: [["Início", "home"], ["Nossa história", "nossa-historia"], ["Cerimônia", "cerimonia"], ["Recepção", "recepcao"], ["Lista de presentes", "presentes"], ["Confirme sua presença", "rsvp"], ["Recados", "recados"]],
  welcome: [
    '“Deus mudou o teu caminho até juntares com o meu e guardou a tua vida separando-a para mim. Para onde fores, irei; onde tu repousares, repousarei; teu Deus será o meu Deus. O teu caminho o meu será.” (Rt 1, 16-17)',
    "Criamos este site para compartilhar com vocês os detalhes da organização do nosso casamento.",
    "Estamos muito felizes e contamos com a presença de todos no nosso grande dia!",
    "Aqui, vocês encontrarão todos os detalhes da cerimônia, a lista de presentes, a localização e muito mais.",
    "Ah, é importante também confirmar sua presença. Para isso, contamos com a sua ajuda: basta clicar no menu “Confirme sua Presença” e preencher os dados necessários.",
    "Caso desejem nos presentear, vocês podem escolher qualquer item da Lista de Casamento, seja um item do nosso site, ou se preferir, da loja física escolhida pelos noivos (Kit Casa - Av. São Sebastião, anexo ao Carvalho Super).",
    "Fiquem à vontade! Aguardamos vocês no nosso grande dia!",
  ],
  story: {
    title: "Nossa história 💙", portrait: storyPortrait.url,
    paragraphs: [
      "Algumas histórias começam de forma simples e, com o tempo, tornam-se especiais. A nossa foi construída com carinho, companheirismo, sonhos compartilhados e muitos momentos que nos trouxeram até aqui.",
      "Ao longo da nossa caminhada, aprendemos que amar também é escolher estar juntos todos os dias, celebrar as pequenas conquistas e seguir lado a lado diante dos desafios.",
      "Agora, damos um novo e importante passo: celebrar diante de Deus e das pessoas que amamos a decisão de caminharmos juntos por toda a vida.",
      "Este dia representa o início de um novo capítulo da nossa história — e será ainda mais especial por podermos compartilhá-lo com vocês.",
      "Com carinho,\nLucas & Cherlane 💙",
    ],
    gallery: [gallery1.url, gallery2.url, gallery3.url, gallery4.url],
  },
  ceremony: {
    title: "Cerimônia", image: ceremonyPhoto.url,
    paragraphs: ['“Assim, eles já não são dois, mas sim uma só carne.” (Mt 19, 6)', "Com o coração cheio de gratidão, queremos convidar vocês para testemunhar o momento em que, diante de Deus, entregaremos um ao outro o nosso “sim”.", "Mais do que celebrar o início de uma nova etapa, queremos receber o Sacramento do Matrimônio e assumir, com amor e fidelidade, a missão de caminhar juntos, construindo nossa família sob a graça e a bênção de Deus, da Sagrada Família e de nossos pais.", "Será uma alegria imensa ter vocês conosco neste momento tão sagrado e especial de nossas vidas.", "Contamos com a presença e as orações de vocês e faremos o possível para sermos pontuais."],
    when: "19 de dezembro de 2026, às 17h na Igreja São Benedito.", address: "Rua Madeira Brandão, 1271 – Bairro São Benedito, Parnaíba – PI, CEP 64202-160", map: "https://www.google.com/maps/search/?api=1&query=Igreja+São+Benedito+Parnaíba+PI",
  },
  reception: { title: "Recepção", image: receptionPhoto.url, text: "O casal convida para recepção no dia 19 de Dezembro de 2026, no Espaço Old, Av. Coronel Lucas Correia, 77 - Bairro Nova Parnaíba, Parnaíba-PI, CEP 64218-760.", note: "A recepção será a partir de 18:30h. Não vai perder, né?", map: "https://www.google.com/maps/search/?api=1&query=Espaço+Old+Parnaíba+PI" },
  gifts: [
    ["Item de teste — pagamento R$ 0,01", 0.01, "ppKf4_1789410146.jpg"],
    ["1 ano de corte de cabelo do noivo", 280, "BTS1P_1789407973.jpg"],
    ["1 ano de papel higiênico para os noivos", 115, "jsB45_1789408359.jpg"],
    ["1 Capacete contra rolo de macarrão da noiva", 115, "IrNS6_1789410052.jpg"],
    ["1 Rolo de macarrão para a noiva", 115, "wWs4V_1789409981.jpg"],
    ["Air fryer", 250, "VCd7G_1789405868.jpg"],
    ["Ajuda para pagar a terapia da noiva depois de organizar o casamento", 120, "WvQb3_1789410845.jpg"],
    ["Ajude a pagar o aluguel", 130, "LHzA1_1789341128.jpg"],
    ["Alexa (para a noiva não mandar só no noivo)", 290, "87EzE_1789411556.jpg"],
    ["Amigos para sempre", 799.90, "hHoU5_1789408265.jpg"],
    ["Amo vocês, mas gastei meu dinheiro com o look", 55, "i6JOz_1789411359.jpg"],
    ["Aviãozinho de dinheiro MA ÔEE", 100, "kliK3_1789411242.jpg"],
    ["Cafeteira", 125, "2lWYx_1789342838.jpg"],
    ["Chaleira elétrica", 125, "2x3De_1789407311.jpg"],
    ["Cobertor para noiva estar sempre coberta de razão", 130, "loA8N_1789418794.jpg"],
    ["Conjunto de copos", 70, "Qwg7Z_1789407820.jpg"],
    ["Conjunto de pratos", 120, "02dkn_1789407703.jpg"],
    ["Conjunto de taças para vinho", 85, "8CMP3_1789342709.jpg"],
    ["Conjunto de xícaras", 80, "FL9hd_1789413939.jpg"],
    ["Cota forno elétrico", 200, "5MJMP_1789342645.jpg"],
    ["Cota mesa de jantar", 260, "hBrg4_1789406467.jpg"],
    ["Cota para aparelho de jantar 20 peças", 125, "oRsf9_1789409371.jpg"],
    ["Cota para cooktop de última geração", 175, "8d41Z_1789410370.jpg"],
    ["Cota para micro-ondas", 190, "0utuM_1789342221.jpg"],
    ["Cota para rack", 140, "jDua3_1789407218.jpg"],
    ["Cota para sofá", 235, "0H5eU_1789341651.jpg"],
    ["Curso engorda marido", 165, "eh2GY_1789410726.jpg"],
    ["Dei o melhor presente", 1000, "ggMl4_1789410249.jpg"],
    ["Deus tocou seu coração", 899.90, "4GbdL_1789410749.jpg"],
    ["Escorredor de louças", 90, "VoR4w_1789407882.jpg"],
    ["Faqueiro", 110, "shopping-camicado/Faqueiro_Prata_Pisa_130_Pecas.jpg"],
    ["Ferro elétrico", 125, "shopping-camicado/Ferro_a_Vapor_FX2200_1200W.jpg"],
    ["Frigideira", 65, "shopping-camicado/Frigideira_Smart_Plus_New_20.jpg"],
    ["Jantar italiano romântico na lua de mel", 150, "jfy6o_1789408502.jpg"],
    ["Jogar o buquê na sua direção", 220, "gYA8y_1789408130.jpg"],
    ["Jogo americano", 80, "Q6rHz_1789413886.jpg"],
    ["Jogo de cama (tamanho Queen)", 240, "mXEc9_1789430653.jpg"],
    ["Jogo de Panelas 5 Peças", 350, "shopping-camicado/Jogo_de_Panelas_Vermont_5.jpg"],
    ["Jogo de toalha", 120, "sIi1Y_1789414118.jpg"],
    ["Kit churrasco de patrão", 230, "ZRN29_1789412162.jpg"],
    ["Kit ferramenta (para a noiva fazer o noivo trabalhar no final de semana)", 145, "ymi0A_1789411708.jpg"],
    ["Moedor de Pimenta", 60, "kEsh3_1789409215.jpg"],
    ["Multiprocessador", 300, "shopping-camicado/Multiprocessador_Chrome_7_Pecas.jpg"],
    ["Para fazer a noiva desmaiar de alegria", 500, "D3yDE_1789419893.jpg"],
    ["Pipoqueira Elétrica", 155, "shopping-camicado/Pipoqueira_Eletrica_Pop_Movie.jpg"],
    ["Sanduicheira", 85, "BinA4_1789343000.jpg"],
    ["Seja nosso parente preferido (oportunidade única!!!)", 599.90, "9Dtd4_1789409278.jpg"],
    ["Só pra não dizer que não dei nada", 50, "ppKf4_1789410146.jpg"],
    ["Vale night para a noiva tomar vinho com as amigas", 150, "g9n3O_1789410967.jpg"],
    ["Vale night para o noivo tomar cerveja com os amigos", 150, "Pk6RZ_1789411088.jpg"],
    ["Vaso de vidro", 60, "Ycor1_1789414028.jpg"],
  ].map(([name, price, file]) => ({
    name: String(name),
    price: Number(price),
    image: String(file).startsWith("shopping-camicado/")
      ? `${catalogGiftBase}/${file}`
      : `${giftBase}/${file}`,
  })),
} as const;
