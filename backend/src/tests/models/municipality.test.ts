import { ChangeLog, Municipality, Parish, State, User } from '@/models'
import * as changeLogger from '@/utils/change-logger'

describe('Municipality model', () => {
  let systemUser: User
  let logHookSpy: jest.SpyInstance

  beforeEach(async () => {
    systemUser = await User.create(
      { username: 'TestUser', passwordHash: 'pw' },
      { userId: 0 }
    )
    logHookSpy = jest
      .spyOn(changeLogger, 'logHook')
      .mockResolvedValue(undefined)
  })

  afterEach(() => {
    if (logHookSpy) logHookSpy.mockRestore()
  })

  it('should create municipality with valid name and stateId and call create log hook', async () => {
    const state = await State.create(
      { name: 'Nueva Esparta' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Margarita', stateId: state.id },
      { userId: systemUser.id }
    )
    expect(municipality).toBeDefined()
    expect(municipality.name).toBe('Margarita')
    expect(municipality.stateId).toBe(state.id)
    expect(logHookSpy).toHaveBeenCalledWith(
      'create',
      expect.any(Municipality),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.MUNICIPALITY,
        modelId: municipality.id,
      })
    )
  })

  it('should fail if name is missing', async () => {
    const state = await State.create(
      { name: 'Nueva Esparta' },
      { userId: systemUser.id }
    )
    expect.assertions(1)
    try {
      await Municipality.create(
        { stateId: state.id },
        { userId: systemUser.id }
      )
    } catch (err: any) {
      expect(err.name).toMatch(/Sequelize.*Error/)
    }
  })

  it('should update municipality name and call update log hook', async () => {
    const state = await State.create(
      { name: 'Bolívar' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Angostura', stateId: state.id },
      { userId: systemUser.id }
    )
    municipality.name = 'Ciudad Bolívar'
    await municipality.save({ userId: systemUser.id })
    expect(municipality.name).toBe('Ciudad Bolívar')
    expect(logHookSpy).toHaveBeenCalledWith(
      'update',
      expect.any(Municipality),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.MUNICIPALITY,
        modelId: municipality.id,
      })
    )
  })

  it('should soft-delete municipality and call delete log hook', async () => {
    const state = await State.create(
      { name: 'Bolívar' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Angostura', stateId: state.id },
      { userId: systemUser.id }
    )
    await municipality.destroy({ userId: systemUser.id })
    const found = await Municipality.findByPk(municipality.id)
    expect(found).toBeNull()
    const deleted = await Municipality.findOne({
      where: { id: municipality.id },
      paranoid: false,
    })
    expect(deleted).toBeDefined()
    expect(deleted?.deletionDate).toBeInstanceOf(Date)
    expect(logHookSpy).toHaveBeenCalledWith(
      'delete',
      expect.any(Municipality),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.MUNICIPALITY,
        modelId: municipality.id,
      })
    )
  })
})

describe('Municipality associations', () => {
  let systemUser: User
  let logHookSpy: jest.SpyInstance

  beforeEach(async () => {
    systemUser = await User.create(
      { username: 'TestUser', passwordHash: 'pw' },
      { userId: 0 }
    )
    logHookSpy = jest
      .spyOn(changeLogger, 'logHook')
      .mockResolvedValue(undefined)
  })

  afterEach(() => {
    if (logHookSpy) logHookSpy.mockRestore()
  })

  it('should associate parishes to municipality and log the actions', async () => {
    const state = await State.create(
      { name: 'Carabobo' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Valencia', stateId: state.id },
      { userId: systemUser.id }
    )
    // Create parish via Parish model and associate
    const parish1 = await Parish.create(
      { name: 'Candelaria', municipalityId: municipality.id },
      { userId: systemUser.id }
    )
    municipality.$add(Municipality.RELATIONS.PARISHES, parish1, {
      userId: systemUser.id,
    })

    // Create and associate a directly
    const parish2 = (await municipality.$create(
      Municipality.RELATIONS_SINGULAR.PARISH,
      { name: 'San José' },
      { userId: systemUser.id }
    )) as Parish

    expect(parish1).toBeDefined()
    expect(parish1.name).toBe('Candelaria')
    expect(parish1.municipalityId).toBe(municipality.id)

    expect(parish2).toBeDefined()
    expect(parish2.name).toBe('San José')
    expect(parish2.municipalityId).toBe(municipality.id)

    // 4 calls: state, municipality, parish1, parish2
    expect(logHookSpy).toHaveBeenCalledTimes(4)
  })

  it('should fetch municipality with its parishes', async () => {
    const state = await State.create(
      { name: 'Lara' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Barquisimeto', stateId: state.id },
      { userId: systemUser.id }
    )
    await Parish.create(
      { name: 'Santa Rosa', municipalityId: municipality.id },
      { userId: systemUser.id }
    )
    await Parish.create(
      { name: 'Juárez', municipalityId: municipality.id },
      { userId: systemUser.id }
    )

    const foundMunicipality = await Municipality.findByPk(municipality.id, {
      include: [Municipality.RELATIONS.PARISHES],
    })
    expect(foundMunicipality).toBeDefined()
    expect(foundMunicipality?.parishes).toBeDefined()
    expect(foundMunicipality?.parishes.length).toBe(2)
    const parishNames = foundMunicipality?.parishes.map((p) => p.name)
    expect(parishNames).toContain('Santa Rosa')
    expect(parishNames).toContain('Juárez')
  })
})
