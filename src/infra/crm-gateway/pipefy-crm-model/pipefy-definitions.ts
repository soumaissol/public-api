const customerTableDefinitions = {
  phoneFieldId: 'telefone',
  emailFieldId: 'e_mail',
  fullNameFieldId: 'nome',
  zipFieldId: 'cep',
  energyConsumption: 'consumo_m_dio_de_energia',
  salesAgentFieldId: 'corretor',
};

const salesAgentTableDefinitions = {
  licenseId: 'creci',
};

const customerLeadCardDefinitions = {
  customerFieldId: 'consumidor',
  salesAgentFieldId: 'corretor',
};

export { customerLeadCardDefinitions, customerTableDefinitions, salesAgentTableDefinitions };
