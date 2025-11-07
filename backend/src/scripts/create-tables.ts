import sequelize from '@/loaders/sequelize'

async function createTables() {
  try {
    console.log('🚀 Creating database tables...')
    
    // Sincronizar modelos con la base de datos (crea tablas)
    await sequelize.sync({ force: false }) // force: false = no borra datos existentes
    
    console.log('✅ All tables created successfully!')
    
    // Verificar tablas creadas
    const tables = await sequelize.getQueryInterface().showAllTables()
    console.log('📋 Tables created:', tables)
    
  } catch (error) {
    console.error('❌ Error creating tables:', error)
  }
}

createTables()
