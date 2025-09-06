import { ChangeLog, Municipality, Parish, State, User } from '@/models'
import * as changeLogger from '@/utils/change-logger'

describe('Parish model', () => {
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

  it('should create parish with valid name and municipalityId and call create log hook', async () => {
    const state = await State.create(
      { name: 'Nueva Esparta' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Margarita', stateId: state.id },
      { userId: systemUser.id }
    )
    const parish = await Parish.create(
      { name: 'La Asunción', municipalityId: municipality.id },
      { userId: systemUser.id }
    )
    expect(parish).toBeDefined()
    expect(parish.name).toBe('La Asunción')
    expect(parish.municipalityId).toBe(municipality.id)
    expect(logHookSpy).toHaveBeenCalledWith(
      'create',
      expect.any(Parish),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.PARISH,
        modelId: parish.id,
      })
    )
  })

  it('should fail if name is missing', async () => {
    const state = await State.create(
      { name: 'Nueva Esparta' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Margarita', stateId: state.id },
      { userId: systemUser.id }
    )
    expect.assertions(1)
    try {
      await Parish.create(
        { municipalityId: municipality.id },
        { userId: systemUser.id }
      )
    } catch (err: any) {
      expect(err.name).toMatch(/Sequelize.*Error/)
    }
  })

  it('should update parish name and call update log hook', async () => {
    const state = await State.create(
      { name: 'Bolívar' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Angostura', stateId: state.id },
      { userId: systemUser.id }
    )
    const parish = await Parish.create(
      { name: 'El Pao', municipalityId: municipality.id },
      { userId: systemUser.id }
    )
    parish.name = 'San Félix'
    await parish.save({ userId: systemUser.id })
    expect(parish.name).toBe('San Félix')
    expect(logHookSpy).toHaveBeenCalledWith(
      'update',
      expect.any(Parish),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.PARISH,
        modelId: parish.id,
      })
    )
  })

  it('should soft-delete parish and call delete log hook', async () => {
    const state = await State.create(
      { name: 'Bolívar' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Angostura', stateId: state.id },
      { userId: systemUser.id }
    )
    const parish = await Parish.create(
      { name: 'El Pao', municipalityId: municipality.id },
      { userId: systemUser.id }
    )
    await parish.destroy({ userId: systemUser.id })
    const found = await Parish.findByPk(parish.id)
    expect(found).toBeNull()
    const deleted = await Parish.findOne({
      where: { id: parish.id },
      paranoid: false,
    })
    expect(deleted).toBeDefined()
    expect(deleted?.deletionDate).toBeInstanceOf(Date)
    expect(logHookSpy).toHaveBeenCalledWith(
      'delete',
      expect.any(Parish),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.PARISH,
        modelId: parish.id,
      })
    )
  })
})

describe('Parish associations', () => {
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

  it('should associate parish with municipality and log the actions', async () => {
    const state = await State.create(
      { name: 'Bolívar' },
      { userId: systemUser.id }
    )
    const municipality = await Municipality.create(
      { name: 'Angostura', stateId: state.id },
      { userId: systemUser.id }
    )
    const parish = await Parish.create(
      { name: 'El Pao', municipalityId: municipality.id },
      { userId: systemUser.id }
    )
    expect(parish.municipalityId).toBe(municipality.id)
    expect(logHookSpy).toHaveBeenCalledWith(
      'create',
      expect.any(Parish),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.PARISH,
        modelId: parish.id,
      })
    )
  })
})
