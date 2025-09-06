import { ChangeLog, Municipality, State, User } from '@/models'
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

  it('should belong to a state', async () => {
    const state = await State.create(
      { name: 'Nueva Esparta' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Margarita', stateId: state.id },
      { userId: systemUser.id }
    )
    const foundMunicipality = await Municipality.findByPk(municipality.id, {
      include: [Municipality.RELATIONS.STATE],
    })
    expect(foundMunicipality).toBeDefined()
    expect(foundMunicipality?.state).toBeDefined()
    expect(foundMunicipality?.state.name).toBe('Nueva Esparta')
  })

  it('should allow same names if in different states', async () => {
    const state1 = await State.create(
      { name: 'Nueva Esparta' },
      { userId: systemUser.id }
    )
    const state2 = await State.create(
      { name: 'Miranda' },
      { userId: systemUser.id }
    )
    const mun1 = await Municipality.create(
      { name: 'Margarita', stateId: state1.id },
      { userId: systemUser.id }
    )
    const mun2 = await Municipality.create(
      { name: 'Margarita', stateId: state2.id },
      { userId: systemUser.id }
    )
    expect(mun1).toBeDefined()
    expect(mun2).toBeDefined()
    expect(mun1.name).toBe(mun2.name)
    expect(mun1.stateId).not.toBe(mun2.stateId)
  })
})
