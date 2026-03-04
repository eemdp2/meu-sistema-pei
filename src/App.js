// --- CONFIGURAÇÕES GLOBAIS ---
const SENHA_AEE = "1234";
let AlunoAtual = "";

// Estrutura de Áreas de Conhecimento solicitada
const areasConhecimento = [
    { 
        titulo: "I. ÁREA DE LINGUAGENS CÓDIGOS E SUAS TECNOLOGIAS", 
        disciplinas: ["LÍNGUA PORTUGUESA", "ARTE", "EDUCAÇÃO FÍSICA", "LÍNGUA INGLESA"] 
    },
    { 
        titulo: "II. ÁREA DE MATEMÁTICA E SUAS TECNOLOGIAS", 
        disciplinas: ["MATEMÁTICA"] 
    },
    { 
        titulo: "III. ÁREA DE CIÊNCIAS HUMANAS E SOCIAIS APLICADAS", 
        disciplinas: ["GEOGRAFIA", "HISTÓRIA"] 
    },
    { 
        titulo: "IV. ÁREA CIÊNCIAS DA NATUREZA E SUAS TECNOLOGIAS", 
        disciplinas: ["CIÊNCIAS"] 
    }
];

const camposAEE = ['nome','freq','alergia','nasc','ano','def','pais','av_inicial','info','potencial','dificuldade','docentes','orient_familia','apoio','orient_outros'];

// --- FUNÇÕES DE INTERFACE ---
function toggleAEE() {
    document.getElementById('contentAEE').classList.toggle('content-expand');
    document.getElementById('arrowAEE').classList.toggle('rotate-180');
}

function desbloquearAEE() {
    if(prompt("Digite a senha de acesso à Sala de Recursos:") === SENHA_AEE) {
        document.getElementById('overlayAEE').classList.add('hidden');
    } else {
        alert("Senha incorreta!");
    }
}

// --- LÓGICA DE DADOS ---
function trocarEstudante() {
    AlunoAtual = document.getElementById('selectEstudante').value;
    if(!AlunoAtual) return;
    carregarAEE();
    carregarMateria();
}

function salvarAEE() {
    if(!AlunoAtual) return alert("Selecione um estudante primeiro!");
    let dados = {};
    camposAEE.forEach(campo => {
        dados[campo] = document.getElementById(`aee_${campo}`).value;
    });
    localStorage.setItem(`aee_${AlunoAtual}`, JSON.stringify(dados));
    alert("✅ Dados da Sala de Recursos (AEE) salvos com sucesso!");
}

function carregarAEE() {
    const salvo = JSON.parse(localStorage.getItem(`aee_${AlunoAtual}`)) || {};
    camposAEE.forEach(campo => {
        document.getElementById(`aee_${campo}`).value = salvo[campo] || '';
    });
}

function carregarMateria() {
    const materia = document.getElementById('materiaAtiva').value;
    const salvo = JSON.parse(localStorage.getItem(`${AlunoAtual}_${materia}`)) || {u:'', o:'', ht:'', hp:'', mt:'', av:''};
    document.getElementById('u').value = salvo.u;
    document.getElementById('o').value = salvo.o;
    document.getElementById('ht').value = salvo.ht;
    document.getElementById('hp').value = salvo.hp;
    document.getElementById('mt').value = salvo.mt;
    document.getElementById('av').value = salvo.av;
}

function salvarMateria() {
    if(!AlunoAtual) return alert("Selecione um aluno!");
    const materia = document.getElementById('materiaAtiva').value;
    const dados = {
        u: document.getElementById('u').value,
        o: document.getElementById('o').value,
        ht: document.getElementById('ht').value,
        hp: document.getElementById('hp').value,
        mt: document.getElementById('mt').value,
        av: document.getElementById('av').value
    };
    localStorage.setItem(`${AlunoAtual}_${materia}`, JSON.stringify(dados));
    alert(`✅ Planejamento de ${materia} salvo!`);
}

// --- EXPORTAÇÃO PDF (AEE 1-6 + ÁREAS AGRUPADAS) ---
async function exportarPDF() {
    if(!AlunoAtual) return alert("Por favor, selecione um estudante!");
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const aee = JSON.parse(localStorage.getItem(`aee_${AlunoAtual}`)) || {};

    // Cabeçalho Oficial
    const logoImg = document.querySelector('header img');
    if (logoImg) {
        try {
            const canvas = document.createElement("canvas");
            canvas.width = logoImg.naturalWidth; canvas.height = logoImg.naturalHeight;
            canvas.getContext("2d").drawImage(logoImg, 0, 0);
            doc.addImage(canvas.toDataURL("image/png"), 'PNG', 85, 10, 40, 18);
        } catch(e) {}
    }

    doc.setFontSize(10).setFont('helvetica', 'bold').text("GOVERNO DO ESTADO DE MATO GROSSO", 105, 32, {align: 'center'});
    doc.setFontSize(8).text("SECRETARIA DE ESTADO DE EDUCAÇÃO - SEDUC", 105, 36, {align: 'center'});
    doc.setDrawColor(31, 56, 100).setLineWidth(0.5).line(15, 42, 195, 42);
    doc.setFontSize(12).text(`PLANO EDUCACIONAL INDIVIDUALIZADO - PEI 2026`, 105, 52, {align: 'center'});

    // 1 - IDENTIFICAÇÃO
    doc.autoTable({
        startY: 60,
        head: [[{content: '1 - IDENTIFICAÇÃO DO ESTUDANTE', colSpan: 3, styles: {fillColor: [31, 56, 100], halign: 'center'}}]],
        body: [
            [{content: `NOME DO ESTUDANTE: ${(aee.nome || AlunoAtual).toUpperCase()}`, colSpan: 3}],
            [{content: `Frequência na Unidade Escolar: ${aee.freq || '-'}`}, {content: `( ) Infrequente    ( ) Regular    ( X ) Assíduo`, colSpan: 2}],
            [{content: `Intolerância Alimentar / Alergia: ${aee.alergia || 'Não'}`, colSpan: 3}],
            [`Data de Nascimento:\n${aee.nasc || '-'}`, `Ano de escolaridade:\n${aee.ano || '-'}`, `Deficiência ou condição:\n${aee.def || '-'}`],
            [{content: `Nome dos pais ou responsável legal: ${aee.pais || '-'}`, colSpan: 3}]
        ],
        theme: 'grid', styles: {fontSize: 7.5, cellPadding: 2}
    });

    // 2 E 3 - CALENDÁRIO E BIO
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 5,
        head: [[{content: '2 – CALENDÁRIO DE EXECUÇÃO DO PEI', colSpan: 4, styles: {fillColor: [31, 56, 100]}}]],
        body: [
            [{content: 'Delimitação Temporal: BIMESTRAL - 1º Bimestre', styles: {fontStyle: 'bold'}}, `Início:\n19/01/2026`, `1ª Revisão:\n02/02/2026`, {content: `Avaliação inicial:\n${aee.av_inicial || '-'}`, rowSpan: 2}],
            [{content: '', styles: {cellPadding: 0}}, '', `2ª Revisão:\n22/04/2026`, '']
        ],
        theme: 'grid', styles: {fontSize: 7}
    });

    doc.autoTable({
        startY: doc.lastAutoTable.finalY,
        head: [[{content: '3 – Informações sobre o/a estudante', styles: {fillColor: [240, 240, 240], textColor: [0, 0, 0]}}]],
        body: [[aee.info || '-']],
        theme: 'grid', styles: {fontSize: 7}
    });

    // 4 E 5 - DOCENTES E ORIENTAÇÃO
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 5,
        head: [[{content: '4 – IDENTIFICAÇÃO DOS DOCENTES', colSpan: 2, styles: {fillColor: [31, 56, 100]}}]],
        body: [
            [{content: `Nomes dos PROFESSORES REGENTES:\n${aee.docentes || '-'}`, colSpan: 2}],
            [`Professor(a) AEE/SRM: ${aee.apoio || '-'}`, `Apoio Pedagógico Especializado: -`]
        ],
        theme: 'grid', styles: {fontSize: 7}
    });

    doc.autoTable({
        startY: doc.lastAutoTable.finalY,
        head: [[{content: '5 – ORIENTAÇÃO COLABORATIVA', colSpan: 2, styles: {fillColor: [31, 56, 100]}}]],
        body: [
            [{content: `Família:\n${aee.orient_familia || '-'}`, styles: {cellWidth: 90}}, {content: `Outros Profissionais:\n${aee.orient_outros || '-'}`, styles: {cellWidth: 90}}]
        ],
        theme: 'grid', styles: {fontSize: 7}
    });

    // 6 - CARACTERIZAÇÃO
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 5,
        head: [[{content: '6 – CARACTERIZAÇÃO DA APRENDIZAGEM', colSpan: 2, styles: {fillColor: [31, 56, 100]}}]],
        body: [
            [{content: 'Potencialidades:', styles: {fontStyle: 'bold'}}, {content: 'Dificuldades:', styles: {fontStyle: 'bold'}}],
            [{content: aee.potencial || '-'}, {content: aee.dificuldade || '-'}]
        ],
        theme: 'grid', styles: {fontSize: 7}
    });

    // --- PÁGINAS DE REGÊNCIA (MODO PAISAGEM) ---
    doc.addPage('a4', 'l');
    doc.setFontSize(12).setFont(undefined, 'bold').text("REGÊNCIA DE CLASSE - PLANEJAMENTO POR ÁREAS DE CONHECIMENTO", 148, 15, {align: 'center'});
    
    let curY = 25;

    areasConhecimento.forEach(area => {
        if (curY > 180) { doc.addPage('a4', 'l'); curY = 20; }
        doc.setFillColor(230, 230, 230);
        doc.rect(14, curY, 269, 7, 'F');
        doc.setFontSize(9).text(area.titulo, 16, curY + 5);
        curY += 10;

        area.disciplinas.forEach(disc => {
            const dados = JSON.parse(localStorage.getItem(`${AlunoAtual}_${disc}`)) || {u:'-', o:'-', ht:'-', hp:'-', mt:'-', av:'-'};
            if (curY > 170) { doc.addPage('a4', 'l'); curY = 20; }
            doc.setFontSize(8).setFont(undefined, 'bold').text(disc, 14, curY);
            doc.autoTable({
                startY: curY + 2,
                head: [['UNIDADES', 'OBJETOS', 'HAB. TURMA', 'HAB. PAEDE', 'METODOLOGIA', 'AVALIAÇÃO']],
                body: [[dados.u, dados.o, dados.ht, dados.hp, dados.mt, dados.av]],
                theme: 'grid', styles: {fontSize: 6.5}, headStyles: {fillColor: [40, 40, 40]}
            });
            curY = doc.lastAutoTable.finalY + 8;
        });
        curY += 5;
    });

    // Assinaturas
    if (curY > 160) { doc.addPage('a4', 'l'); curY = 30; } else { curY += 10; }
    doc.line(20, curY + 20, 90, curY + 20); doc.text("Professor(a) AEE", 55, curY + 24, {align: 'center'});
    doc.line(110, curY + 20, 180, curY + 20); doc.text("Professor(a) Regente", 145, curY + 24, {align: 'center'});
    doc.line(200, curY + 20, 270, curY + 20); doc.text("Coordenação Pedagógica", 235, curY + 24, {align: 'center'});

    doc.save(`PEI_2026_${AlunoAtual}.pdf`);
}
