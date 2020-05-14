import { useStore } from '../../src/hooks/store'

describe('test useStore fails', () => {
    it('useStore throws', () => {
        expect(useStore).toThrow(Error)
    })
})
