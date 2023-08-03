const customerTableDefinitions = {
  phoneFieldId: 'telefone',
  emailFieldId: 'e_mail',
  fullNameFieldId: 'nome',
  zipFieldId: 'cep',
  energyConsumption: 'consumo_m_dio_de_energia',
  salesAgentFieldId: 'corretor',
};

const salesAgentTableDefinitions = {
  licenseFieldId: 'creci',
  phoneFieldId: 'telefone',
  fullNameFieldId: 'nome',
  agencyFieldId: 'ag_ncia',
  emailFieldId: 'email',
  occupationFieldId: 'ocupacao',
  cityAndStateFieldId: 'cidade_e_estado',
};

const customerLeadCardDefinitions = {
  customerFieldId: 'consumidor',
  salesAgentFieldId: 'corretor',
};

const salesAgentLeadCardDefinitions = {
  salesAgentFieldId: 'corretor',
};

export {
  customerLeadCardDefinitions,
  customerTableDefinitions,
  salesAgentLeadCardDefinitions,
  salesAgentTableDefinitions,
};
