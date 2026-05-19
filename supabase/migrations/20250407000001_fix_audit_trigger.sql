-- Fix write_audit_log() to safely extract org_id and user_id
-- from tables that may not have those columns (e.g. organizations).
-- Uses to_jsonb() for safe dynamic field access instead of direct record access.

CREATE OR REPLACE FUNCTION write_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_record_id UUID;
  target_org_id UUID;
  target_user_id UUID;
  payload JSONB;
BEGIN
  IF TG_OP = 'DELETE' THEN
    payload := to_jsonb(OLD);
  ELSE
    payload := to_jsonb(NEW);
  END IF;

  target_record_id := (payload->>'id')::UUID;

  target_org_id := COALESCE(
    (payload->>'organization_id')::UUID,
    (payload->>'org_id')::UUID
  );
  -- For the organizations table itself, use the row id as org_id.
  IF target_org_id IS NULL AND TG_TABLE_NAME = 'organizations' THEN
    target_org_id := target_record_id;
  END IF;

  target_user_id := COALESCE(
    (payload->>'user_id')::UUID,
    (payload->>'owner_user_id')::UUID
  );

  INSERT INTO audit_log (table_name, record_id, action, user_id, org_id, changed_data)
  VALUES (TG_TABLE_NAME, target_record_id, TG_OP, target_user_id, target_org_id, payload);

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;
