# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Use `Array.prototype.concat` instead of array spread so that babel will inject fewer helpers into the final bundle
- Dropped the `react-dom` dependency because we don't technically need it.

## [1.1.2] - 2019-06-07

### Changed

- Switched to using `@culturehq/scripts` for development.
- Use the `prepublishOnly` npm script to avoid checking in the `dist` directory.

## [1.1.1] - 2019-03-12

### Changed

- Added the necessary deps for the `useCallback` hook inside the `makeStandaloneHook` and `makeArgumentHook` functions.

## [1.1.0] - 2019-02-22

### Added

- Hooks for most of the existing mutations, including:
  - `useAppend`
  - `useConcat`
  - `useCycle`
  - `useDecrement`
  - `useFilter`
  - `useIncrement`
  - `useMap`
  - `usePrepend`
  - `useToggle`
- Factories for creating your own hooks, including `makeStandaloneHook` and `makeArgumentHook`.

### Changed

- `react` and `react-dom` are now peer dependencies.

## [1.0.0] - 2018-11-13

### Added

- The single value equivalents of all of the existing mutations, by appending `State` to the name of each. e.g., there is now an equivalent mutation for `append` that will work with a single value called `appendState`. This allows the use of this library with hooks, i.e.,

```
import React, { useState } from "react";
import { appendState } from "react-state-mutations";

const StudentList = () => {
  const [list, setList] = useState(["Harry Potter"]);
  const [name, setName] = useState("");

  const onAddStudent = () => {
    setList(appendState(name));
    setName("");
  };

  return (
    <>
      <ul>
        {list.map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <input type="text" name="name" value={name} onChange={setName} />
      <button type="button" onClick={onAddStudent}>Add Student</button>
    </>
  );
};
```

### Removed

- The `makeCallbackMutation` as it was only being used for `map` and `filter` and it's trivial to make it work with `makeArgumentMutation`.

## [0.3.0] - 2018-10-25

### Added

- The `concat` mutation.

## [0.2.0] - 2018-09-06

### Added

- The `map` mutation.
- The `makeCallbackMutation` mutation builder.
- The `cycle` mutation.
- The `direct` mutation.

## [0.1.1] - 2018-09-05

### Changed

- Rebuilt distribution (`filter` was missing in `0.1.0`).

## [0.1.0] - 2018-08-28

### Added

- The `filter` mutation for filtering a list of objects.

[unreleased]: https://github.com/CultureHQ/react-state-mutations/compare/v1.1.2...HEAD
[1.1.2]: https://github.com/CultureHQ/react-state-mutations/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/CultureHQ/react-state-mutations/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/CultureHQ/react-state-mutations/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/CultureHQ/react-state-mutations/compare/v0.3.0...v1.0.0
[0.3.0]: https://github.com/CultureHQ/react-state-mutations/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/CultureHQ/react-state-mutations/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/CultureHQ/react-state-mutations/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/CultureHQ/react-state-mutations/compare/2938cf...v0.1.0
