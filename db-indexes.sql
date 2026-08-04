-- DocMate — indexes for columns used in list/filter queries.
-- Safe to run more than once (IF NOT EXISTS is supported on MariaDB 10.5+;
-- production runs 11.8). Adding an index does not change data.
--
-- Run against: u785953539_docmate_datab
--
-- Why: the doctor listing and search pages filter on status, specialty and
-- city on every request. Without indexes MySQL scans the whole table each
-- time. Cheap to add, and the cost grows with the doctor count.

CREATE INDEX IF NOT EXISTS `Doctor_status_idx`    ON `Doctor` (`status`);
CREATE INDEX IF NOT EXISTS `Doctor_specialty_idx` ON `Doctor` (`specialty`);
CREATE INDEX IF NOT EXISTS `Doctor_type_idx`      ON `Doctor` (`type`);
CREATE INDEX IF NOT EXISTS `Clinic_city_idx`      ON `Clinic` (`city`);

-- Verify:
--   SHOW INDEX FROM `Doctor`;
--   SHOW INDEX FROM `Clinic`;
--
-- These are declared in prisma/schema.prisma as @@index(...) too, so a future
-- `prisma migrate` stays in sync rather than trying to drop them.
