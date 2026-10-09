import { ShareButton } from "@/app/components/share-button";

// Texto oficial fornecido na issue #73. Preservar redação, pontuação e ordem.
const manifesto = {
  title:
    "TRABALHADORES DE TECNOLOGIA CONTRA FLÁVIO BOLSONARO, VOTO CRÍTICO EM LULA 13",
  paragraphs: [
    "Acabou o primeiro turno da eleição presidencial de 2026 e com ele uma certeza se colocou no horizonte: a ameaça da extrema direita e tudo o que ela representa está forte e tem espaço em nossa realidade. No entanto, a vitória de Flávio Bolsonaro juntamente com a ampliação de seu peso no legislativo representam um enorme perigo para os trabalhadores brasileiros, que não têm absolutamente nada a ganhar com esse projeto autoritário, que ameaça as liberdades democráticas, aponta para a construção de um regime autoritário e procura criar as condições para aprofundar ainda mais os ataques contra os trabalhadores e entregar definitivamente o país a Trump.",
    "Trata-se de um projeto que combina autoritarismo com o aprofundamento da barbárie capitalista, por meio de cortes profundos nas áreas sociais, retirada de direitos, ataques aos setores oprimidos, privatizações, garantia dos lucros dos grandes empresários e entrega das riquezas nacionais aos EUA. Por isso, nós, do setor de tecnologia, acreditamos que nesse momento devemos chamar voto crítico em Lula contra Flávio Bolsonaro neste segundo turno. É fundamental derrotar Flávio Bolsonaro e a extrema direita, inclusive preparando, desde já, as mobilizações que serão necessárias contra seu eventual governo.",
    "Esse voto, no entanto, não representa qualquer apoio político a Lula ou ao seu governo de aliança com a burguesia. Sabemos muito bem que, do ponto de vista da classe trabalhadora, não houve avanços durante o governo Lula. Ao contrário. Nesse período, não somente ele deixou de revogar a reforma trabalhista, como havia prometido, mas também implementou ataques contra os trabalhadores, como o arcabouço fiscal, manteve as privatizações, negociou com Trump, para quem está entregando as terras raras, e assegurou os interesses da burguesia, governando em aliança com o Centrão e a direita.",
    "Na prática, não houve qualquer iniciativa de reverter a decadência do país em relação aos demais países do mundo e nós, do setor de tecnologia, sofremos diretamente com isso. Isso porque o rebaixamento do Brasil na divisão internacional do trabalho significa na prática não desenvolver e nem disputar setores de ponta do processo produtivo. Ficamos à mercê da tecnologia estrangeira, sendo, inclusive, substituídos por profissionais que nem no Brasil estão. Com isso, nosso salário é reduzido, nossas condições de trabalho atacadas e acabamos, por fim, perdendo nossos empregos. E temos potencial para reverter isso. Mas com uma política entreguista, o Brasil vai ficando cada vez mais para trás nessa disputa.",
    "Além disso, Lula foi eleito prometendo derrotar o bolsonarismo, mas, depois de quatro anos, não apenas o bolsonarismo não foi derrotado, como também saiu ainda mais fortalecido. Por isso precisamos dizer: votar no Lula, por si só, não será capaz de derrotar a força política e as bases sociais que sustentam o bolsonarismo. Por isso, o voto em Lula precisa ser crítico e estar colocado a serviço da construção de uma alternativa capaz de superar o projeto político do PT.",
    "Derrotar o clã Bolsonaro e Trump exige que os trabalhadores apresentem e defendam um projeto contra o sistema e enfrentem o poder da burguesia e nós trabalhadores de tecnologia, somos parte disso. Para alcançar esse objetivo, os trabalhadores precisam manter sua independência política diante dos diferentes projetos capitalistas. Essa é uma das grandes tarefas colocadas para a classe trabalhadora de conjunto.",
    "Vamos para as ruas derrotar Bolsonaro, apresentar e defender nossas pautas e construir um processo permanente de luta, de independência de classe e de organização, capaz de enfrentar de verdade Trump e o bolsonarismo, derrotar o sistema, construir uma nova forma de sociedade por uma tecnologia a serviço do povo. Por isso defendemos e exigimos de um eventual governo Lula:",
  ],
  demands: [
    {
      title: "ENFRENTAR O COLONIALISMO DIGITAL, EM DEFESA DA SOBERANIA DIGITAL",
      text: "Superar o domínio imperialista das corporações estrangeiras sobre a infraestrutura digital e a expropriação de dados exige a construção de uma soberania tecnológica popular e comunitária, garantindo a autonomia da sociedade para decidir quais tecnologias servem às suas necessidades reais.",
    },
    {
      title: "NÃO AO LOBBY DAS BIG TECHS, SIM AO SOFTWARE LIVRE",
      text: "Gigantes da tecnologia operam globalmente com o auxílio de pesadas estratégias de lobby, cujo objetivo é sufocar, atrasar ou aniquilar tentativas governamentais de regulamentação. Devemos resgatar a filosofia radical do software livre e utilizá-lo como alicerce para construir infraestruturas estatais sem a dependência do setor privado bilionário.",
    },
    {
      title: "NÃO AOS CARTÉIS DE DADOS",
      text: "Os dados gerados por nossa população e instituições estão sendo apropriados unilateralmente. Para romper com o oligopólio privado que mercantiliza informações, é necessária a criação de uma nuvem pública e estatal brasileira, impedindo a entrega dos nossos dados a multinacionais e estabelecendo as bases para que sejam um bem público e comum.",
    },
    {
      title:
        "NÃO À PRECARIZAÇÃO DO TRABALHO, FIM DA ESCALA 6X1 E DAS JORNADAS EXTENUANTES",
      text: 'Defendemos a revogação das reformas trabalhista e da previdência! Enfrentar o "chicote digital" da gestão algorítmica e a superexploração exige a redução da jornada de trabalho sem redução salarial (com o fim da escala 6x1), revertendo os ganhos de produtividade da automação em direitos, descanso e qualidade de vida para a classe trabalhadora.',
    },
    {
      title: "DATA CENTERS E A EXPLORAÇÃO PREDATÓRIA",
      text: "Frear o consumo predatório de água e energia, bem como a poluição gerada pela expansão desenfreada dos data centers, impedindo incentivos fiscais extrativistas e impondo um rigoroso controle ambiental e público sobre a infraestrutura computacional instalada no país.",
    },
    {
      title: "REGULAÇÃO DAS REDES SOCIAIS",
      text: "É urgente enfrentar a chantagem política e o monopólio das Big Techs, que usam algoritmos opacos para lucrar com a polarização, o ódio e a manipulação do debate público. Defendemos uma regulação antimonopolista e democrática que imponha transparência algorítmica, corresponsabilidade sobre conteúdos nocivos e controle social, transformando a comunicação digital em um bem público a serviço da sociedade.",
    },
    {
      title: "REINDUSTRIALIZAÇÃO E FORTALECIMENTO DA INDÚSTRIA NACIONAL",
      text: "É preciso reverter a reprimarização da economia e o papel do Brasil como mero fornecedor de commodities. Isso exige a expansão da indústria tecnológica nacional com a criação de novas estatais, o investimento nas já existentes (como SERPRO, DATAPREV e CEITEC) e a abertura de concursos públicos.",
    },
    {
      title: "CONSELHOS POPULARES DE TRABALHADORES DA TECNOLOGIA",
      text: "Defendemos a criação de conselhos com a participação de trabalhadores, sindicatos, pesquisadores, universidades e movimentos sociais, garantindo que os profissionais de TI e a sociedade direcionem os rumos do desenvolvimento tecnológico.",
    },
    {
      title: "POR UMA TECNOLOGIA A SERVIÇO DO POVO",
      text: "É necessário romper com a lógica capitalista, que utiliza as revoluções técnicas para intensificar a exploração, e reconstruir a ciência e as ferramentas digitais como instrumentos públicos de emancipação, justiça social e bem-estar coletivo.",
    },
  ],
} as const;

export function ManifestoFullText() {
  return (
    <section className="manifesto-full" aria-labelledby="manifesto-completo">
      <div className="manifesto-full-column">
        <h2 id="manifesto-completo" tabIndex={-1}>
          {manifesto.title}

          <ShareButton
            title="Manifesto Tech Contra Flávio Bolsonaro"
            description="Compartilhe nas redes sociais o manifesto da comunidade Tech Contra Flávio Bolsonaro"
            url="/manifesto"
            variant="home-colors"
            className="inline-block ml-4!"
          />
        </h2>
        <div className="manifesto-full-intro">
          {manifesto.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="manifesto-full-demands">
          {manifesto.demands.map((demand) => (
            <div className="manifesto-full-demand" key={demand.title}>
              <h3>{demand.title}</h3>
              <p>{demand.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
