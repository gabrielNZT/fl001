import React from 'react';
import { Card, Typography, Collapse } from 'antd';

const { Panel } = Collapse;
const { Text } = Typography;

const Rules = () => {
    return (
        <Card title="Regras do Bolão">
            <Collapse accordion>
                <Panel header="1. O Bolão" key="1" >
                    <Text>
                        O Bolão foi criado para dar voz a comunidade eSports, proporcionando uma experiência empolgante de apostas nos times preferidos ou naqueles que se destacam. Nosso propósito é criar um ambiente divertido e participativo, unindo os entusiastas do cenário competitivo de League of Legends em torno de previsões emocionantes.
                    </Text>

                    <Collapse style={{ marginTop: '16px' }}>
                        <Panel header="1.1 Sobre o Site" key="1.1">
                            <Text>
                                Este site não apenas permite o registro das apostas de forma intuitiva, mas também proporciona uma experiência aprimorada ao possibilitar o acompanhamento da pontuação de cada participante em tempo real, diretamente na tabela do jogo. A interatividade e praticidade oferecidas pela plataforma garantem uma participação envolvente e fácil acompanhamento do desempenho de todos os jogadores.
                            </Text>
                        </Panel>

                        <Panel header="1.2 Grupo de WhatsApp" key="1.2">
                            <Text>
                                O grupo no WhatsApp servirá como nosso principal canal de comunicação, proporcionando uma plataforma dinâmica para discussões sobre as apostas e os emocionantes jogos que estão por vir. Através deste espaço interativo, teremos a oportunidade de compartilhar insights, trocar opiniões e manter uma atmosfera vibrante em torno das expectativas do cenário. Participem ativamente e tornem nossa experiência ainda mais envolvente!
                            </Text>
                        </Panel>
                    </Collapse>
                </Panel>

                <Panel header="2. Quem Pode Participar?" key="2">
                    <Text>
                        Qualquer pessoa pode participar do Bolão, bastando realizar o cadastro na plataforma.
                    </Text>

                    <Collapse style={{ marginTop: '16px' }}>
                        <Panel header="2.1 Fatores Desclassificantes" key="2.1">
                            <Text>
                                Dentre os fatores desclassificantes, incluem-se comportamentos antiéticos, desrespeito de qualquer natureza, seja em relação a times ou mesmo com a intenção de prejudicar outra pessoa. Além disso, discussões sobre temas não relacionados ao foco do Bolão também serão consideradas como um fator passível de punição. Buscamos manter um ambiente saudável e respeitoso para a experiência positiva de todos os participantes.
                            </Text>
                        </Panel>
                    </Collapse>
                </Panel>

                <Panel header="3. Como Apostar?" key="3">
                    <Text>
                        De maneira intuitiva, basta selecionar o Bolão de 2024. Ao acessar, os confrontos disponíveis para apostas serão exibidos. Para fazer sua escolha, clique sobre o NOME do time desejado - ele mudará de cor, e uma confirmação será exibida na tela.
                    </Text>

                    <Collapse style={{ marginTop: '16px' }}>
                        <Panel header="3.1 Sistema de Pontuação" key="3.1">
                            <Text>
                                Ao realizar suas apostas para o final de semana, há a oportunidade de ganhar até 10 pontos. Isso é distribuído em 5 pontos para os jogos de sábado e 5 pontos para os jogos de domingo, atribuindo 1 ponto para cada acerto.
                            </Text>

                            <Collapse style={{marginTop: '16px'}}>
                                <Panel header="3.1.1 Sistema de Pontuação Playoffs" key="3.1.1">
                                    <Text>
                                        Quando chegarmos aos playoffs, a pontuação seguirá uma dinâmica diferenciada, introduzindo décimos para tornar a disputa ainda mais emocionante. Por exemplo, acertar o vencedor de um confronto entre dois times concederá 1,5 pontos. Haverá também a oportunidade de acertar o placar exato da MD5; se o palpite estiver correto para o time vencedor, você adicionará mais 1 ponto ao resultado final, totalizando assim 2,5 pontos no confronto.
                                    </Text>
                                </Panel>
                            </Collapse>

                        </Panel>

                        <Panel header="3.2 Horário de Apostas" key="3.2">
                            <Text>
                                Todas as apostas serão abertas às segundas-feiras que antecedem o final de semana dos jogos. Por exemplo, os jogos ocorridos nos dias 27 e 28 de janeiro estarão disponíveis para apostas a partir da segunda-feira, dia 22 de janeiro. Quanto aos horários, as apostas para os jogos de sábado serão encerradas às 13h do próprio sábado, repetindo-se esse padrão para os jogos de domingo. Certifique-se de realizar suas apostas a tempo.
                            </Text>
                        </Panel>

                        <Panel header="3.3 Alterações de Apostas" key="3.3">
                            <Text>
                                O sistema oferece a flexibilidade de realizar alterações nas apostas, desde que sejam efetuadas antes do horário estipulado conforme a regra acima. Certifique-se de ajustar suas escolhas dentro do prazo especificado para garantir que suas apostas estejam alinhadas.
                            </Text>
                        </Panel>

                        <Panel header="3.4 Playoffs" key="3.4">
                            <Text>
                                Ao entrarmos na fase dos playoffs, uma novidade exclusiva será introduzida: uma nova aba que possibilitará a realização de apostas nos placares de cada confronto em MD5. Essa adição proporcionará uma experiência mais detalhada e estratégica, permitindo que os participantes expressem suas previsões de maneira ainda mais precisa. Olhe a regra 3.1.1.
                            </Text>
                        </Panel>
                    </Collapse>

                </Panel>

                <Panel header="4. Premiações" key="4">
                    <Text>
                        O ápice desta competição amadora entre os participantes será marcado pela gratificação dos 4 primeiros colocados com as maiores pontuações de todo o split. A distribuição das premiações ocorrerá após a realização da final, sendo assim:
                    </Text>
                    <ul>
                        <li>1° Lugar: 4.035 RP</li>
                        <li>2° Lugar: 1.990 RP</li>
                        <li>3° Lugar: 1.585 RP</li>
                        <li>4° Lugar: 755 RP</li>
                    </ul>
                    <Text>
                        Essas recompensas não apenas reconhecem o desempenho excepcional dos vencedores, mas também adicionam um toque especial à experiência do Bolão.
                    </Text>
                </Panel>
            </Collapse>
        </Card>
    );
};

export default Rules;
