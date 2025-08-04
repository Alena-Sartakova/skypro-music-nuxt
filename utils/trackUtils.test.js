import { describe, expect, it } from "vitest";
import { formatDuration, filterTracks, getAvailableFilters, updateFilters, resetFilters } from "../utils/tracksUtils";

describe("formatDuration", () => {
  it("форматирует секунды в mm:ss", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(5)).toBe("0:05");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(600)).toBe("10:00");
    expect(formatDuration(3599)).toBe("59:59");
    expect(formatDuration()).toBe("");
  });
});

const mockTracks = [
  {
    title: 'Rock Anthem',
    author: 'The Rockers',
    release_date: '2020',
    genre: ['Rock', 'Alternative'],
    duration: '3:45'
  },
  {
    title: 'Jazz Night',
    author: 'Cool Quartet',
    release_date: '2021',
    genre: ['Jazz'],
    duration: '5:20'
  },
  {
    title: 'Pop Hit 2022',
    author: 'Star Singer',
    release_date: '2022',
    genre: ['Pop'],
    duration: '3:15'
  },
  {
    title: 'Classic Mix',
    author: 'The Rockers',
    release_date: '2020',
    genre: ['Classic'],
    duration: '4:30'
  }
]

describe('filterTracks', () => {
it('фильтрует по автору', () => {
  const result = filterTracks(mockTracks, { 
    search: '', 
    author: 'Star Singer' 
  });
  expect(result).toHaveLength(1);
  expect(result[0].title).toBe('Pop Hit 2022');
});

it('фильтрует по году', () => {
  const result = filterTracks(mockTracks, { 
    search: '', 
    year: '2020' 
  });
  expect(result).toHaveLength(2);
});

it('фильтрует по жанру', () => {
  const result = filterTracks(mockTracks, { 
    search: '', 
    genre: 'Jazz' 
  });
  expect(result).toHaveLength(1);
  expect(result[0].title).toBe('Jazz Night');
});

it('комбинирует несколько фильтров', () => {
  const result = filterTracks(mockTracks, { 
    search: '', 
    author: 'The Rockers', 
    genre: 'Rock', 
    year: '2020' 
  });
  expect(result).toHaveLength(1);
});

it('возвращает все треки при пустых фильтрах', () => {
  const result = filterTracks(mockTracks, { 
    search: '', 
    author: '', 
    genre: '', 
    year: '' 
  });
  expect(result).toHaveLength(mockTracks.length);
});

it('корректно обрабатывает undefined фильтры', () => {
  const result = filterTracks(mockTracks, undefined);
  expect(result).toHaveLength(mockTracks.length);
});

it('корректно обрабатывает null фильтры', () => {
 const result = filterTracks(mockTracks, null);
 expect(result).toHaveLength(mockTracks.length);
});
})

describe('getAvailableFilters', () => {
  it('возвращает уникальные значения фильтров', () => {
    const filters = getAvailableFilters(mockTracks)
    
    expect(filters.authors).toEqual(['Cool Quartet', 'Star Singer', 'The Rockers'])
    expect(filters.years).toEqual(['2022', '2021', '2020'])
    expect(filters.genres).toEqual(['Alternative', 'Classic', 'Jazz', 'Pop', 'Rock'])
  })

  it('обрабатывает пустой массив треков', () => {
    const filters = getAvailableFilters([])
    
    expect(filters.authors).toEqual([])
    expect(filters.years).toEqual([])
    expect(filters.genres).toEqual([])
  })

  it('корректно обрабатывает треки без жанров', () => {
    const tracks = [...mockTracks, { genre: [] }]
    const filters = getAvailableFilters(tracks)
    expect(filters.genres).toEqual(['Alternative', 'Classic', 'Jazz', 'Pop', 'Rock'])
  })
})

describe('updateFilters', () => {
  it('обновляет отдельные поля фильтров', () => {
    const current = { author: 'Old', genre: 'Rock', year: '', search: '' }
    const updated = updateFilters(current, { year: '2020', search: 'test' })
    
    expect(updated).toEqual({
      author: 'Old',
      genre: 'Rock',
      year: '2020',
      search: 'test'
    })
  })

  it('полностью заменяет значения', () => {
    const current = { author: 'Old', genre: 'Rock', year: '1999', search: 'old' }
    const updated = updateFilters(current, {
      author: 'New',
      genre: 'Pop',
      year: '2023',
      search: 'new'
    })
    
    expect(updated).toEqual({
      author: 'New',
      genre: 'Pop',
      year: '2023',
      search: 'new'
    })
  })

  it('не изменяет исходный объект', () => {
    const current = { author: 'Original' }
    updateFilters(current, { author: 'Changed' })
    expect(current.author).toBe('Original')
  })
})

describe('resetFilters', () => {
  it('возвращает фильтры по умолчанию', () => {
    const result = resetFilters()
    expect(result).toEqual({
      author: '',
      genre: '',
      year: '',
      search: ''
    })
  })

  it('возвращает новый объект при каждом вызове', () => {
    const first = resetFilters()
    const second = resetFilters()
    expect(first).not.toBe(second)
  })
})