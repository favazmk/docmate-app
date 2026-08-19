-- DocMate — adds Doctor.displayOrder, the admin-controlled position of a doctor
-- on the public "Find a doctor" page.
--
-- Run against: u785953539_docmate_datab
--
-- ⚠️ RUN THIS *BEFORE* DEPLOYING THE CODE THAT USES IT.
-- The search page and the admin doctor list order by this column. Deploy the
-- code first and those pages return a 500 (Prisma P2022, "column does not
-- exist") until the column lands. Running this first is harmless to the old
-- code, which simply ignores a column it does not know about.
--
-- This is additive and non-destructive: it adds a column with a default and an
-- index. No existing row is modified, no data is read or dropped. Every current
-- doctor is stamped 9999 = "not positioned".
--
-- Why 9999 rather than 0: the list sorts ascending, so unpositioned doctors
-- have to sort *after* the pinned ones. A 0 default would push every
-- unpositioned doctor to the top and invert the whole feature.

-- IF NOT EXISTS makes this safe to run twice (MariaDB 10.0+; production is 11.8).
ALTER TABLE `Doctor`
  ADD COLUMN IF NOT EXISTS `displayOrder` INT NOT NULL DEFAULT 9999;

CREATE INDEX IF NOT EXISTS `Doctor_displayOrder_idx` ON `Doctor` (`displayOrder`);

-- Verify:
--   SHOW COLUMNS FROM `Doctor` LIKE 'displayOrder';
--   SHOW INDEX FROM `Doctor`;
--   SELECT id, name, displayOrder FROM `Doctor` ORDER BY displayOrder ASC LIMIT 10;
--
-- Rollback, if ever needed (this DOES discard the positions the admin has set):
--   ALTER TABLE `Doctor` DROP COLUMN `displayOrder`;
--
-- Declared in prisma/schema.prisma as `displayOrder Int @default(9999)` with an
-- @@index, so a future `prisma migrate` stays in sync rather than re-adding it.
