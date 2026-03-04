function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape'); // 'landscape' para caber as 6 colunas melhor

    // Cabeçalho conforme o documento original [cite: 3]
    doc.setFontSize(10);
    doc.text("UNIDADE ESCOLAR: ESCOLA ESTADUAL MILITAR DOM PEDRO II", 10, 10);
    doc.setFontSize(14);
    doc.text("PLANO EDUCACIONAL INDIVIDUALIZADO (PEI)", 140, 20, { align: "center" });

    // Tabela com as 6 colunas da imagem 
    doc.autoTable({
        startY: 40,
        head: [['UNIDADES TEMÁTICAS', 'OBJETOS DE CONHECIMENTO', 'HABILIDADES PARA A TURMA', 'HABILIDADES PARA O PAEDE', 'METODOLOGIA', 'AVALIAÇÃO']],
        body: [
            // Aqui o sistema puxa os dados salvos de cada professor
            ['Fábulas', 'Substantivos', '(EF69LP47)', '(EF06LP12)', 'Tempo estendido', 'Formativa']
        ],
        theme: 'grid',
        headStyles: { fillColor: [31, 56, 100], textColor: [255, 255, 255] }, // Azul marinho conforme imagem
        styles: { fontSize: 8, overflow: 'linebreak' }
    });

    // Bloco de Assinaturas conforme o final do documento [cite: 10, 11, 12, 13]
    let finalY = doc.lastAutoTable.finalY + 20;
    doc.text("__________________________", 20, finalY);
    doc.text("COORDENAÇÃO PEDAGÓGICA", 20, finalY + 5);
    doc.text("__________________________", 180, finalY);
    doc.text("SALA DE RECURSOS (AEE)", 180, finalY + 5);

    doc.save("PEI_Victor_Moises.pdf");
}
