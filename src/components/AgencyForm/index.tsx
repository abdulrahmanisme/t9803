// Add notification when a new agency is submitted
const handleSubmit = async (values: AgencyFormData) => {
  try {
    const { data: agency, error } = await supabase
      .from('agencies')
      .insert([
        {
          ...values,
          owner_id: user?.id,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Notify admins about new submission
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('email')
      .eq('is_super_admin', true);

    if (!adminsError && admins) {
      for (const admin of admins) {
        await sendEmailNotification({
          to: admin.email,
          template: 'new_agency',
          data: {
            agencyName: values.name,
            location: values.location,
            contactEmail: values.contact_email,
          },
        });
      }
    }

    toast.success('Agency submitted successfully');
    onSuccess?.(agency);
  } catch (error) {
    console.error('Failed to submit agency:', error);
    toast.error('Failed to submit agency');
  }
};
