/**
 * Copyright (C) 2018 Bernardo Balvanera
 *
 * This file is part of ProtegoPdf.
 *
 * ProtegoPdf is a free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// just a quick way to prove a "theory"
__dirname.toString();
process.versions.electron = '1.7.10';
const isPdfDocument = require('./lib/').isPdfDocument;

isPdfDocument('./tests/test-data/test.corrupted.pdf')
  .then((result) => {
    console.log(result);
  })
  .catch((reason) => {
    console.log(reason);
  });
