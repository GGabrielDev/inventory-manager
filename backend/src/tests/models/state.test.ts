import { ChangeLog, State, User } from '@/models'
import * as changeLogger from '@/utils/change-logger'

describe('State model', () => {
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

  it('should create state with valid name and call create log hook', async () => {
    const state = await State.create(
      { name: 'Nueva Esparta' },
      { userId: systemUser.id }
    )
    expect(state).toBeDefined()
    expect(state.name).toBe('Nueva Esparta')
    expect(logHookSpy).toHaveBeenCalledWith(
      'create',
      expect.any(State),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.STATE,
        modelId: state.id,
      })
    )
  })

  it('should fail if name is missing', async () => {
    expect.assertions(1)
    try {
      await State.create({}, { userId: systemUser.id })
    } catch (err: any) {
      expect(err.name).toMatch(/Sequelize.*Error/)
    }
  })

  it('should not allow duplicate state names', async () => {
    expect.assertions(1)
    await State.create({ name: 'Falcón' }, { userId: systemUser.id })
    try {
      await State.create({ name: 'Falcón' }, { userId: systemUser.id })
    } catch (err: any) {
      expect(err.name).toMatch(/Sequelize.*Error/)
    }
  })

  it('should update state name and call update log hook', async () => {
    const state = await State.create(
      { name: 'Bolívar' },
      { userId: systemUser.id }
    )
    state.name = 'Angostura'
    await state.save({ userId: systemUser.id })
    expect(state.name).toBe('Angostura')
    expect(logHookSpy).toHaveBeenCalledWith(
      'update',
      expect.any(State),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.STATE,
        modelId: state.id,
      })
    )
  })

  it('should soft-delete state and call delete log hook', async () => {
    const state = await State.create(
      { name: 'Zulia' },
      { userId: systemUser.id }
    )
    logHookSpy.mockClear()
    await state.destroy({ userId: systemUser.id })
    const found = await State.findByPk(state.id)
    expect(found).toBeNull()
    const deleted = await State.findByPk(state.id, { paranoid: false })
    expect(deleted).toBeDefined()
    expect(deleted?.deletionDate).toBeInstanceOf(Date)
    expect(logHookSpy).toHaveBeenCalledWith(
      'delete',
      expect.any(State),
      expect.objectContaining({
        userId: systemUser.id,
        modelName: ChangeLog.RELATIONS.STATE,
        modelId: state.id,
      })
    )
  })
})
