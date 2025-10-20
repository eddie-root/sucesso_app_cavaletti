
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import formatCurrency from '../utils/money';
import { assets } from '../assets/assets.js'; // Importando a logo

// Register fonts
Font.register({
    family: 'Roboto',
    fonts: [
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
        { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    ]
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Roboto',
        fontSize: 8,
        padding: 30,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #000',
        paddingBottom: 10,
        marginBottom: 5,
    },
    headerLogo: {
        width: 120,
        height: 50,
        objectFit: 'contain',
    },
    headerTitle: {
        textAlign: 'center',
    },
    headerTitleMain: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    headerTitleSub: {
        fontSize: 10,
    },
    section: {
        border: '1px solid #000',
        marginBottom: 10,
        padding: 5,
    },
    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sectionCol: {
        width: '49%',
    },
    sectionColRight: {
        // width: '49%',
        textAlign: 'right',
    },
    field: {
        marginBottom: 2,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 7,
    },
    value: {
        fontSize: 8,
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#000',
        marginTop: 5,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#f2f2f2',
        padding: 4,
        fontWeight: 'bold',
        fontSize: 7,
        textAlign: 'center',
    },
    tableCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 4,
        fontSize: 8,
    },
    colCod: { width: '14%' },
    colProd: { width: '42%' },
    colQtd: { width: '8%', textAlign: 'center' },
    colPrice: { width: '12%', textAlign: 'right' },
    colDisc: { width: '12%', textAlign: 'right' },
    colTotal: { width: '12%', textAlign: 'right' },
    summary: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    summaryBox: {
        width: '30%',
        border: '1px solid #000',
        padding: 5,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    totalRow: {
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 7,
        color: '#555',
    },
    observation: {
        marginTop: 5,
        border: '1px solid #000',
        padding: 5,
    }
});

const Field = ({ label, value }) => (
    <View style={styles.field}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value || ''}</Text>
    </View>
);

const PageContent = ({ order }) => (
    <>
        {/* Header */}
        <View style={styles.header}>
            <Image style={styles.headerLogo} src={assets.logo} />
            <View style={styles.headerTitle}>
                <Text style={styles.headerTitleMain}>Sucesso Representações</Text>
                <Text style={styles.headerTitleSub}>Pedido Nº {order.orderNumber}</Text>
            </View>
            <View style={{ width: 120, height: 50 }}>
                <Image style={styles.headerLogo} src={assets.logo3} />
            </View>
        </View>

        {/* Representada Info */}
        <View style={[styles.section, styles.sectionRow]}>
            <Field label="Representada" value="Cavaletti S/A Cadeiras Profissionais" />
            <Field label="CNPJ" value="00.882.413/0001-74" />
        </View>

        {/* Client Info */}
        <View style={styles.section}>
            <View style={styles.sectionRow}>
                <View style={styles.sectionCol}>
                    <Field label="Cliente" value={order.client?.rSocial} />
                    <Field label="CNPJ" value={order.client?.cnpj} />
                    <Field label="SUFRAMA" value={order.client?.suframa} />
                    <Field label="Endereço" value={`${order.client?.address}, ${order.client?.bairro}`} />
                    <Field label="Cidade" value={order.client?.city} />
                    <Field label="Telefone" value={order.client?.phone} />
                </View>
                <View style={styles.sectionColRight}>
                    <Field label="Nome Fantasia" value={order.client?.nFantasia} />
                    <Field label="Inscrição Estadual" value={order.client?.inscEstadual} />
                    <Field label="CEP" value={order.client?.cep} />
                    <Field label="Estado" value={order.client?.county} />
                    <Field label="E-mail" value={order.client?.email} />
                </View>
            </View>
        </View>

        {/* Order Details Section */}
        <View style={styles.section}>
            <View style={styles.sectionRow}>
                <View style={styles.sectionCol}>
                    <Field label="Data de Emissão" value={new Date(order.createdAt).toLocaleDateString()} />
                    <Field label="Condição de Pagamento" value={order.prazo} />
                </View>
                <View style={styles.sectionColRight}>
                    <Field label="Transportadora" value={order.transportadora} />
                    <Field label="Tipo de Frete" value="FOB" />
                </View>
            </View>
        </View>
    </>
);

const OrderPDF = ({ order }) => {
    const productsChunks = [];
    const chunkSize = 5;
    for (let i = 0; i < order.products.length; i += chunkSize) {
        productsChunks.push(order.products.slice(i, i + chunkSize));
    }

    return (
        <Document>
            {productsChunks.map((chunk, pageIndex) => (
                <Page key={pageIndex} size="A4" style={styles.page} break={pageIndex > 0}>
                    <PageContent order={order} />

                    {/* Order Items */}
                    <Text style={{...styles.label, marginBottom: 2}}>Itens do Pedido:</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableColHeader, styles.colCod]}>Código</Text>
                            <Text style={[styles.tableColHeader, styles.colProd]}>Produto</Text>
                            <Text style={[styles.tableColHeader, styles.colQtd]}>Qtd.</Text>
                            <Text style={[styles.tableColHeader, styles.colPrice]}>Preço Unit.</Text>
                            <Text style={[styles.tableColHeader, styles.colDisc]}>Descontos</Text>
                            <Text style={[styles.tableColHeader, styles.colTotal]}>Total</Text>
                        </View>
                        {chunk.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={[styles.tableCol, styles.colCod]}>{item.productId?.codp}</Text>
                                <View style={[styles.tableCol, styles.colProd]}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 8 }}>{item.productId?.name}</Text>
                                    {item.description && <Text style={{ fontSize: 7 }}>{Array.isArray(item.description) ? item.description.join(' - ') : item.description}</Text>}
                                    {item.tela && <Text style={{ fontSize: 7 }}>Tela: {item.tela}</Text>}
                                    {item.revestimento && <Text style={{ fontSize: 7 }}>Revestimento: {item.revestimento}</Text>}
                                </View>
                                <Text style={[styles.tableCol, styles.colQtd]}>{item.quantity}</Text>
                                <Text style={[styles.tableCol, styles.colPrice]}>{formatCurrency(item.price)}</Text>
                                <Text style={[styles.tableCol, styles.colDisc]}>
                                    {Object.values(item.discounts || {}).map(d => `${d}%`).join(' + ')}
                                </Text>
                                <Text style={[styles.tableCol, styles.colTotal]}>{formatCurrency(item.totalPriceAfterDiscount)}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Summary and Footer only on the last page */}
                    {pageIndex === productsChunks.length - 1 && (
                        <>
                            {/* Summary */}
                            <View style={styles.summary}>
                                <View style={styles.summaryBox}>
                                    <View style={styles.summaryRow}>
                                        <Text>Subtotal</Text>
                                        <Text>{formatCurrency(order.totalAmount)}</Text>
                                    </View>
                                    <View style={[styles.summaryRow, styles.totalRow]}>
                                        <Text>Total</Text>
                                        <Text>{formatCurrency(order.totalAmount)}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Observation */}
                            {order.observation && (
                                <View style={styles.observation}>
                                    <Text style={styles.label}>Observações:</Text>
                                    <Text style={styles.value}>{order.observation}</Text>
                                </View>
                            )}

                            {/* Footer */}
                            <Text style={styles.footer}>
                                Este é um documento gerado por computador.
                            </Text>
                        </>
                    )}
                </Page>
            ))}
        </Document>
    );
};

export default OrderPDF;
